import ExcelJS from "exceljs";
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "fs";
import { join } from "path";

interface TestRecord {
  testName: string;
  suiteName: string;
  status: "passed" | "failed" | "skipped" | "timedOut";
  duration: number;
  file: string;
  lineNumber: number;
  error: string;
  retries: number;
  tags: string[];
  timestamp: string;
  env: string;
}

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

function loadMonthlyData(env: string, month: string, dataDir: string): TestRecord[][] {
  const monthlyFile = join(dataDir, `${env.toLowerCase()}_${month}.json`);
  if (!existsSync(monthlyFile)) {
    console.log(`No monthly data found for ${env} - ${month}`);
    return [];
  }
  return JSON.parse(readFileSync(monthlyFile, "utf-8"));
}

function getAllMonths(env: string, dataDir: string): string[] {
  if (!existsSync(dataDir)) return [];
  const files = readdirSync(dataDir).filter((f) => f.startsWith(env.toLowerCase() + "_"));
  return files
    .map((f) => f.replace(env.toLowerCase() + "_", "").replace(".json", ""))
    .sort();
}

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

function findFlakyTests(dailyRuns: TestRecord[][]): FlakyTest[] {
  const testMap = new Map<
    string,
    { passes: number; failures: number; totalRuns: number; file: string; suite: string; lastError: string }
  >();

  for (const dayRecords of dailyRuns) {
    const seen = new Set<string>();
    for (const record of dayRecords) {
      const key = record.testName;
      if (seen.has(key)) continue;
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

async function generateMonthlySummary(env: string, month: string, dataDir: string, outputDir: string) {
  const dailyRuns = loadMonthlyData(env, month, dataDir);

  if (dailyRuns.length === 0) {
    console.log(`No data to generate monthly summary for ${env} - ${month}`);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Playwright Monthly Summary Report";
  workbook.created = new Date();

  await addOverviewSheet(workbook, env, month, dailyRuns);
  await addDailyBreakdownSheet(workbook, env, month, dailyRuns);
  await addFlakyTestsSheet(workbook, env, dailyRuns);
  await addFailedTestsAnalysisSheet(workbook, env, month, dailyRuns);
  await addTestTrendSheet(workbook, env, dailyRuns);

  mkdirSync(outputDir, { recursive: true });
  const filename = `${env.toLowerCase()}_monthly_summary_${month}.xlsx`;
  const filepath = join(outputDir, filename);

  const buffer = await workbook.xlsx.writeBuffer();
  writeFileSync(filepath, buffer as Buffer);
  console.log(`\n📊 Monthly summary generated: ${filepath}`);
}

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

  const sheet = workbook.addWorksheet("Failed Tests Analysis", { properties: { tabColor: { argb: "FFFF0000" } } });

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

main().catch(console.error);
