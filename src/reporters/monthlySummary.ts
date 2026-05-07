// ============================================================
// Monthly Summary Generator
// Reads accumulated JSON from daily runs and produces a 5-sheet
// Excel workbook with aggregated metrics for the month.
//
// DAILY BREAKDOWN: new rows are APPENDED incrementally.
// Aggregate sheets (Overview, Flaky Tests, etc.) are recalculated
// from all data. No data is ever deleted.
// ============================================================

import ExcelJS from "exceljs";
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "fs";
import { join } from "path";

// A single test result (same shape as excelReporter.ts)
interface TestRecord {
  testName: string;
  suiteName: string;
  status: "passed" | "failed" | "skipped" | "timedOut" | "interrupted";
  duration: number;
  file: string;
  lineNumber: number;
  error: string;
  retries: number;
  tags: string[];
  timestamp: string;
  env: string;
}

// A test that passed on some days and failed on others
interface FlakyTest {
  name: string;
  suite: string;
  file: string;
  failCount: number;
  passCount: number;
  totalRuns: number;
  failRate: number;
  lastError: string;
}

// ----------------------------------------------------------
// Load all daily-run arrays for a given env + month from JSON
// ----------------------------------------------------------
function loadMonthlyData(env: string, month: string, dataDir: string): TestRecord[][] {
  const monthlyFile = join(dataDir, `${env.toLowerCase()}_${month}.json`);
  if (!existsSync(monthlyFile)) {
    console.log(`No monthly data found for ${env} - ${month}`);
    return [];
  }
  return JSON.parse(readFileSync(monthlyFile, "utf-8"));
}

// List all available month IDs for a given env
function getAllMonths(env: string, dataDir: string): string[] {
  if (!existsSync(dataDir)) return [];
  const files = readdirSync(dataDir).filter((f) => f.startsWith(env.toLowerCase() + "_"));
  return files
    .map((f) => f.replace(env.toLowerCase() + "_", "").replace(".json", ""))
    .sort();
}

// Compute aggregate stats from an array of test records
function calculateStats(records: TestRecord[]) {
  const total = records.length;
  const passed = records.filter((r) => r.status === "passed").length;
  const failed = records.filter((r) => r.status === "failed").length;
  const timedOut = records.filter((r) => r.status === "timedOut").length;
  const skipped = records.filter((r) => r.status === "skipped").length;
  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);

  return {
    total,
    passed,
    failed,
    timedOut,
    skipped,
    totalFailures: failed + timedOut,
    passRate: total > 0 ? (passed / total) * 100 : 0,
    totalDurationMs: totalDuration,
    avgDurationMs: total > 0 ? totalDuration / total : 0,
  };
}

// Identify flaky tests: tests that passed on at least one day
// AND failed on at least one day across the month
function findFlakyTests(dailyRuns: TestRecord[][]): FlakyTest[] {
  const testMap = new Map<
    string,
    { passes: number; failures: number; totalRuns: number; file: string; suite: string; lastError: string }
  >();

  for (const dayRecords of dailyRuns) {
    const seen = new Set<string>();
    for (const record of dayRecords) {
      const key = record.testName;
      if (seen.has(key)) continue;  // count each test once per day
      seen.add(key);

      if (!testMap.has(key)) {
        testMap.set(key, {
          passes: 0,
          failures: 0,
          totalRuns: 0,
          file: record.file,
          suite: record.suiteName,
          lastError: "",
        });
      }

      const entry = testMap.get(key)!;
      entry.totalRuns++;

      if (record.status === "passed") {
        entry.passes++;
      } else if (record.status === "failed" || record.status === "timedOut") {
        entry.failures++;
        entry.lastError = record.error;
      }
    }
  }

  // Filter: must have BOTH passes and failures
  const flaky: FlakyTest[] = [];
  for (const [name, data] of testMap) {
    if (data.failures > 0 && data.passes > 0) {
      flaky.push({
        name,
        suite: data.suite,
        file: data.file,
        failCount: data.failures,
        passCount: data.passes,
        totalRuns: data.totalRuns,
        failRate: (data.failures / data.totalRuns) * 100,
        lastError: data.lastError,
      });
    }
  }

  return flaky.sort((a, b) => b.failRate - a.failRate);
}

// ----------------------------------------------------------
// Helpers for incremental Excel update
// ----------------------------------------------------------

// Read existing dates from Daily Breakdown (column A, skip header + TOTAL row)
function readExistingDates(workbook: ExcelJS.Workbook): string[] {
  const dates: string[] = [];
  const sheet = workbook.getWorksheet("Daily Breakdown");
  if (!sheet) return dates;
  for (let r = 2; r <= sheet.rowCount; r++) {
    const cell = sheet.getCell(r, 1);
    const dateVal = cell.value;
    let dateStr = "";
    if (dateVal instanceof Date) {
      const y = dateVal.getFullYear();
      const m = String(dateVal.getMonth() + 1).padStart(2, "0");
      const d = String(dateVal.getDate()).padStart(2, "0");
      dateStr = `${y}-${m}-${d}`;
    } else if (typeof dateVal === "string") {
      dateStr = dateVal;
    } else if (typeof dateVal === "number") {
      const d = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
      dateStr = d.toISOString().split("T")[0];
    }
    if (dateStr && dateStr !== "TOTAL") {
      dates.push(dateStr);
    }
  }
  return dates;
}

// Find the TOTAL summary row in Daily Breakdown
function findTotalRow(sheet: ExcelJS.Worksheet): number {
  for (let r = sheet.rowCount; r >= 1; r--) {
    if (String(sheet.getCell(r, 1).value) === "TOTAL") return r;
  }
  return -1;
}

// Remove an existing sheet by name and re-add it
async function replaceAggregateSheet(workbook: ExcelJS.Workbook, sheetName: string, addFn: () => Promise<void>) {
  const existing = workbook.getWorksheet(sheetName);
  if (existing) {
    workbook.removeWorksheet(existing.id);
  }
  await addFn();
}

// ============================================================
// Main entry: generate (or update) the monthly summary Excel
// ============================================================
export async function generateMonthlySummary(env: string, month: string, dataDir: string, outputDir: string) {
  const dailyRuns = loadMonthlyData(env, month, dataDir);
  if (dailyRuns.length === 0) {
    console.log(`No data to generate monthly summary for ${env} - ${month}`);
    return;
  }

  mkdirSync(outputDir, { recursive: true });
  const filename = `${env.toLowerCase()}_monthly_summary_${month}.xlsx`;
  const filepath = join(outputDir, filename);

  // ---- FRESH FILE: create all 5 sheets from all data ----
  if (!existsSync(filepath)) {
    console.log(`   No existing file, creating new`);
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Playwright Monthly Summary Report";
    workbook.created = new Date();
    await addOverviewSheet(workbook, env, month, dailyRuns);
    await addDailyBreakdownSheet(workbook, env, month, dailyRuns);
    await addFlakyTestsSheet(workbook, env, dailyRuns);
    await addFailedTestsAnalysisSheet(workbook, env, month, dailyRuns);
    await addTestTrendSheet(workbook, env, dailyRuns);
    const buffer = await workbook.xlsx.writeBuffer();
    writeFileSync(filepath, buffer as unknown as Buffer);
    console.log(`\n📊 Monthly summary generated: ${filepath}`);
    return;
  }

  // ---- EXISTING FILE: append only new days, recalc aggregate sheets ----
  console.log(`   Existing file found: ${filepath}`);
  const workbook = await ExcelJS.Workbook.xlsx.readFile(filepath);
  const existingDates = readExistingDates(workbook);

  const newDays = dailyRuns.filter((day, index) => {
    const date = day[0]?.timestamp?.split("T")[0] || `Day ${index + 1}`;
    return !existingDates.includes(date);
  });

  console.log(`   Existing days: ${existingDates.length}, New days to add: ${newDays.length}`);

  if (newDays.length === 0) {
    console.log(`   No new data to append`);
    return;
  }

  // 1) Append new rows to Daily Breakdown + update TOTAL row
  await appendDailyBreakdownRows(workbook, newDays, dailyRuns);

  // 2) Recalculate Overview metric values in-place
  await updateOverviewSheet(workbook, env, month, dailyRuns);

  // 3) Rebuild aggregate sheets from ALL data
  await replaceAggregateSheet(workbook, "Flaky Tests", () => addFlakyTestsSheet(workbook, env, dailyRuns));
  await replaceAggregateSheet(workbook, `${env} - Failed Tests Analysis`, () => addFailedTestsAnalysisSheet(workbook, env, month, dailyRuns));
  await replaceAggregateSheet(workbook, "Test Trends", () => addTestTrendSheet(workbook, env, dailyRuns));

  const buffer = await workbook.xlsx.writeBuffer();
  writeFileSync(filepath, buffer as unknown as Buffer);
  console.log(`\n📊 Monthly summary updated (appended ${newDays.length} new day(s)): ${filepath}`);
}

// ----------------------------------------------------------
// Append new rows to Daily Breakdown and rewrite the TOTAL row
// ----------------------------------------------------------
async function appendDailyBreakdownRows(workbook: ExcelJS.Workbook, newDays: TestRecord[][], allDailyRuns: TestRecord[][]) {
  const sheet = workbook.getWorksheet("Daily Breakdown")!;

  // Remove old TOTAL row so new rows go before it
  const totalRowIdx = findTotalRow(sheet);
  if (totalRowIdx > 0) {
    sheet.spliceRows(totalRowIdx, 1);
  }

  // Add one row per new day
  newDays.forEach((dayRecords, index) => {
    const stats = calculateStats(dayRecords);
    const date = dayRecords[0]?.timestamp?.split("T")[0] || `Day ${index + 1}`;
    const row = sheet.addRow({
      date,
      total: stats.total,
      passed: stats.passed,
      failed: stats.failed,
      timedOut: stats.timedOut,
      skipped: stats.skipped,
      passRate: `${stats.passRate.toFixed(2)}%`,
      duration: (stats.totalDurationMs / 1000).toFixed(2),
    });

    const passRateCell = row.getCell("passRate");
    if (stats.passRate === 100) {
      passRateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6EFCE" } };
      passRateCell.font = { color: { argb: "FF006100" }, bold: true };
    } else if (stats.passRate >= 80) {
      passRateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
      passRateCell.font = { color: { argb: "FF9C6500" }, bold: true };
    } else {
      passRateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC7CE" } };
      passRateCell.font = { color: { argb: "FF9C0006" }, bold: true };
    }

    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });
  });

  // Re-add TOTAL row using ALL data
  const totals = calculateStats(allDailyRuns.flat());
  const totalRow = sheet.addRow({
    date: "TOTAL",
    total: totals.total,
    passed: totals.passed,
    failed: totals.failed,
    timedOut: totals.timedOut,
    skipped: totals.skipped,
    passRate: `${totals.passRate.toFixed(2)}%`,
    duration: (totals.totalDurationMs / 1000).toFixed(2),
  });
  totalRow.font = { bold: true };
  totalRow.eachCell((cell) => {
    cell.border = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "medium" }, right: { style: "medium" } };
  });
}

// ----------------------------------------------------------
// Update Overview sheet values in-place
// ----------------------------------------------------------
async function updateOverviewSheet(workbook: ExcelJS.Workbook, env: string, month: string, dailyRuns: TestRecord[][]) {
  let sheet = workbook.getWorksheet("Overview");
  if (!sheet) {
    await addOverviewSheet(workbook, env, month, dailyRuns);
    return;
  }

  const allRecords = dailyRuns.flat();
  const stats = calculateStats(allRecords);
  const totalExecutionDays = dailyRuns.length;

  const metricValues: Record<string, string> = {
    "Total Execution Days": totalExecutionDays.toString(),
    "Total Tests Executed": stats.total.toString(),
    "Total Passed": stats.passed.toString(),
    "Total Failed": stats.totalFailures.toString(),
    "Total Skipped": stats.skipped.toString(),
    "Overall Pass Rate": `${stats.passRate.toFixed(2)}%`,
    "Total Execution Time (hrs)": (stats.totalDurationMs / 3600000).toFixed(2),
    "Average Test Duration (ms)": stats.avgDurationMs.toFixed(2),
  };

  for (let r = 1; r <= sheet.rowCount; r++) {
    const metricName = String(sheet.getCell(r, 1).value || "");
    if (metricValues[metricName] !== undefined) {
      sheet.getCell(r, 2).value = metricValues[metricName];
    }
  }
}

// ============================================================
// Sheet 1: Overview — high-level KPIs for the month
// ============================================================
async function addOverviewSheet(workbook: ExcelJS.Workbook, env: string, month: string, dailyRuns: TestRecord[][]) {
  const sheet = workbook.addWorksheet("Overview", { properties: { tabColor: { argb: "FF4472C4" } } });

  const allRecords = dailyRuns.flat();
  const stats = calculateStats(allRecords);
  const totalExecutionDays = dailyRuns.length;

  sheet.columns = [
    { header: "Metric", key: "metric", width: 35 },
    { header: "Value", key: "value", width: 25 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };

  const data = [
    ["Environment", env],
    ["Month", month],
    ["Total Execution Days", totalExecutionDays.toString()],
    ["", ""],
    ["Total Tests Executed", stats.total.toString()],
    ["Total Passed", stats.passed.toString()],
    ["Total Failed", stats.totalFailures.toString()],
    ["Total Skipped", stats.skipped.toString()],
    ["", ""],
    ["Overall Pass Rate", `${stats.passRate.toFixed(2)}%`],
    ["Total Execution Time (hrs)", (stats.totalDurationMs / 3600000).toFixed(2)],
    ["Average Test Duration (ms)", stats.avgDurationMs.toFixed(2)],
  ];

  data.forEach(([metric, value]) => {
    const row = sheet.addRow({ metric, value });
    if (metric) row.getCell("metric").font = { bold: true };
    row.eachCell((cell) => {
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });
  });
}

// ============================================================
// Sheet 2: Daily Breakdown — one row per execution day
// ============================================================
async function addDailyBreakdownSheet(workbook: ExcelJS.Workbook, env: string, month: string, dailyRuns: TestRecord[][]) {
  const sheet = workbook.addWorksheet("Daily Breakdown", { properties: { tabColor: { argb: "FF70AD47" } } });

  sheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Total Tests", key: "total", width: 12 },
    { header: "Passed", key: "passed", width: 12 },
    { header: "Failed", key: "failed", width: 12 },
    { header: "Timed Out", key: "timedOut", width: 12 },
    { header: "Skipped", key: "skipped", width: 12 },
    { header: "Pass Rate", key: "passRate", width: 12 },
    { header: "Duration (s)", key: "duration", width: 14 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF70AD47" } };

  dailyRuns.forEach((dayRecords, index) => {
    const stats = calculateStats(dayRecords);
    const date = dayRecords[0]?.timestamp?.split("T")[0] || `Day ${index + 1}`;

    const row = sheet.addRow({
      date,
      total: stats.total,
      passed: stats.passed,
      failed: stats.failed,
      timedOut: stats.timedOut,
      skipped: stats.skipped,
      passRate: `${stats.passRate.toFixed(2)}%`,
      duration: (stats.totalDurationMs / 1000).toFixed(2),
    });

    const passRateCell = row.getCell("passRate");
    if (stats.passRate === 100) {
      passRateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6EFCE" } };
      passRateCell.font = { color: { argb: "FF006100" }, bold: true };
    } else if (stats.passRate >= 80) {
      passRateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
      passRateCell.font = { color: { argb: "FF9C6500" }, bold: true };
    } else {
      passRateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC7CE" } };
      passRateCell.font = { color: { argb: "FF9C0006" }, bold: true };
    }

    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });
  });

  const totals = calculateStats(dailyRuns.flat());
  const totalRow = sheet.addRow({
    date: "TOTAL",
    total: totals.total,
    passed: totals.passed,
    failed: totals.failed,
    timedOut: totals.timedOut,
    skipped: totals.skipped,
    passRate: `${totals.passRate.toFixed(2)}%`,
    duration: (totals.totalDurationMs / 1000).toFixed(2),
  });
  totalRow.font = { bold: true };
  totalRow.eachCell((cell) => {
    cell.border = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "medium" }, right: { style: "medium" } };
  });

  sheet.views = [{ state: "frozen", ySplit: 1 }];
}

// ============================================================
// Sheet 3: Flaky Tests — tests that passed AND failed this month
// ============================================================
async function addFlakyTestsSheet(workbook: ExcelJS.Workbook, env: string, dailyRuns: TestRecord[][]) {
  const flakyTests = findFlakyTests(dailyRuns);

  const sheet = workbook.addWorksheet("Flaky Tests", { properties: { tabColor: { argb: "FFFFC000" } } });

  sheet.columns = [
    { header: "No.", key: "no", width: 6 },
    { header: "Test Name", key: "name", width: 50 },
    { header: "Suite", key: "suite", width: 35 },
    { header: "File", key: "file", width: 40 },
    { header: "Total Runs", key: "totalRuns", width: 12 },
    { header: "Passed", key: "passCount", width: 10 },
    { header: "Failed", key: "failCount", width: 10 },
    { header: "Fail Rate", key: "failRate", width: 12 },
    { header: "Last Error", key: "lastError", width: 60 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC000" } };

  if (flakyTests.length === 0) {
    sheet.addRow({ no: 1, name: "No flaky tests detected!", suite: "", file: "", totalRuns: "", passCount: "", failCount: "", failRate: "", lastError: "" });
  } else {
    flakyTests.forEach((test, index) => {
      const row = sheet.addRow({
        no: index + 1,
        name: test.name,
        suite: test.suite,
        file: test.file,
        totalRuns: test.totalRuns,
        passCount: test.passCount,
        failCount: test.failCount,
        failRate: `${test.failRate.toFixed(2)}%`,
        lastError: test.lastError,
      });

      const rateCell = row.getCell("failRate");
      if (test.failRate > 50) {
        rateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC7CE" } };
        rateCell.font = { color: { argb: "FF9C0006" }, bold: true };
      }

      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
      });
    });
  }

  sheet.views = [{ state: "frozen", ySplit: 1 }];
}

// ============================================================
// Sheet 4: Failed Tests Analysis — grouped by test, with dates
// Sheet name includes env prefix to avoid cross-env overwrites
// ============================================================
async function addFailedTestsAnalysisSheet(workbook: ExcelJS.Workbook, env: string, month: string, dailyRuns: TestRecord[][]) {
  const allFailed = dailyRuns.flat().filter((r) => r.status === "failed" || r.status === "timedOut");

  const failureCounts = new Map<string, { count: number; error: string; file: string; suite: string; dates: string[] }>();

  for (const record of allFailed) {
    const key = record.testName;
    const date = record.timestamp.split("T")[0];
    if (!failureCounts.has(key)) {
      failureCounts.set(key, { count: 0, error: record.error, file: record.file, suite: record.suiteName, dates: [] });
    }
    const entry = failureCounts.get(key)!;
    entry.count++;
    if (!entry.dates.includes(date)) entry.dates.push(date);
  }

  const sortedFailures = Array.from(failureCounts.entries()).sort((a, b) => b[1].count - a[1].count);

  // Env prefix prevents STAGE and PROD from overwriting each other's sheet
  const sheet = workbook.addWorksheet(`${env} - Failed Tests Analysis`, { properties: { tabColor: { argb: "FFFF0000" } } });

  sheet.columns = [
    { header: "No.", key: "no", width: 6 },
    { header: "Test Name", key: "testName", width: 50 },
    { header: "Suite", key: "suite", width: 35 },
    { header: "File", key: "file", width: 40 },
    { header: "Failures", key: "count", width: 12 },
    { header: "Failed Dates", key: "dates", width: 25 },
    { header: "Error Details", key: "error", width: 70 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF0000" } };

  sortedFailures.forEach(([name, data], index) => {
    const row = sheet.addRow({
      no: index + 1,
      testName: name,
      suite: data.suite,
      file: data.file,
      count: data.count,
      dates: data.dates.join(", "),
      error: data.error,
    });

    row.eachCell((cell) => {
      cell.alignment = { vertical: "top", wrapText: true };
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });
  });

  sheet.views = [{ state: "frozen", ySplit: 1 }];
}

// ============================================================
// Sheet 5: Test Trends — per-test success rate across all days
// ============================================================
async function addTestTrendSheet(workbook: ExcelJS.Workbook, env: string, dailyRuns: TestRecord[][]) {
  const sheet = workbook.addWorksheet("Test Trends", { properties: { tabColor: { argb: "FF9B59B6" } } });

  sheet.columns = [
    { header: "Test Name", key: "name", width: 55 },
    { header: "Total Runs", key: "runs", width: 12 },
    { header: "Passes", key: "passes", width: 10 },
    { header: "Failures", key: "failures", width: 10 },
    { header: "Success Rate", key: "rate", width: 14 },
    { header: "Avg Duration (ms)", key: "avgDuration", width: 16 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF9B59B6" } };

  const testStats = new Map<string, { runs: number; passes: number; failures: number; durations: number[] }>();

  for (const dayRecords of dailyRuns) {
    const seen = new Set<string>();
    for (const record of dayRecords) {
      if (seen.has(record.testName)) continue;
      seen.add(record.testName);

      if (!testStats.has(record.testName)) {
        testStats.set(record.testName, { runs: 0, passes: 0, failures: 0, durations: [] });
      }

      const entry = testStats.get(record.testName)!;
      entry.runs++;
      entry.durations.push(record.duration);

      if (record.status === "passed") entry.passes++;
      else if (record.status === "failed" || record.status === "timedOut") entry.failures++;
    }
  }

  const sortedTests = Array.from(testStats.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  sortedTests.forEach(([name, data]) => {
    const rate = data.runs > 0 ? (data.passes / data.runs) * 100 : 0;
    const avgDuration = data.durations.length > 0 ? data.durations.reduce((a, b) => a + b, 0) / data.durations.length : 0;

    const row = sheet.addRow({
      name,
      runs: data.runs,
      passes: data.passes,
      failures: data.failures,
      rate: `${rate.toFixed(2)}%`,
      avgDuration: avgDuration.toFixed(2),
    });

    const rateCell = row.getCell("rate");
    if (rate === 100) {
      rateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6EFCE" } };
    } else if (rate >= 80) {
      rateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
    } else {
      rateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC7CE" } };
    }

    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle" };
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });
  });

  sheet.views = [{ state: "frozen", ySplit: 1 }];
}

// ============================================================
// CLI entry point
// e.g. npm run report:monthly:stage -- --env=STAGE --month=2026-05
// ============================================================
async function main() {
  const args = process.argv.slice(2);
  const env = args.find((a) => a.startsWith("--env="))?.split("=")[1]?.toUpperCase() || "ALL";
  const month = args.find((a) => a.startsWith("--month="))?.split("=")[1];

  if (!month) {
    const now = new Date();
    var monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  } else {
    var monthStr = month;
  }

  const dataDir = "test-results/excel-reports/monthly-data";
  const outputDir = "test-results/excel-reports";

  const envs = env === "ALL" ? ["STAGE", "PROD"] : [env];

  for (const e of envs) {
    console.log(`\nGenerating monthly summary for ${e} - ${monthStr}...`);
    await generateMonthlySummary(e, monthStr, dataDir, outputDir);
  }

  console.log("\nMonthly summary generation complete!");
}

// Guard: only run main() when executed directly
if (process.argv[1]?.endsWith("monthlySummary.ts")) {
  main().catch(console.error);
}
