// ============================================================
// Excel Reporter — Playwright custom reporter
// Generates daily Excel reports and accumulates monthly JSON data
// ============================================================

import { Reporter, FullConfig, Suite, TestCase, TestResult, TestStep, FullResult } from "@playwright/test/reporter";
import ExcelJS from "exceljs";
import { join, dirname } from "path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import { generateMonthlySummary } from "./monthlySummary";

// Shape of a single test result record stored in JSON / Excel
interface TestRecord {
  testName: string;
  suiteName: string;
  status: "passed" | "failed" | "skipped" | "timedOut" | "interrupted";
  duration: number;       // milliseconds
  file: string;           // relative path to spec file
  lineNumber: number;
  error: string;          // error message + stack trace
  retries: number;
  tags: string[];         // parsed from test title (@tag convention)
  timestamp: string;      // ISO 8601
  env: string;            // STAGE or PROD
}

class ExcelReporter implements Reporter {
  // Accumulates all test results during the run
  private testRecords: TestRecord[] = [];
  private suiteName: string = "";
  private outputDir: string;
  private envName: string = "unknown";

  constructor(options: { outputDir?: string; env?: string } = {}) {
    this.outputDir = options.outputDir || "test-results/excel-reports";
    this.envName = options.env || this.detectEnv();
  }

  // ----------------------------------------------------------
  // Playwright lifecycle hooks
  // ----------------------------------------------------------

  // Called when the test run begins — determine environment
  onBegin(config: FullConfig, suite: Suite) {
    this.suiteName = suite.title || "Test Suite";
    if (this.envName === "unknown") {
      this.envName = this.detectEnvFromSuite(suite);
    }
    mkdirSync(this.outputDir, { recursive: true });
  }

  // Auto-detect environment from TEST_ENV env var or npm script name
  private detectEnv(): string {
    if (process.env.TEST_ENV) return process.env.TEST_ENV.toUpperCase();
    const npmEvent = process.env.npm_lifecycle_event || "";
    if (npmEvent.includes("prod")) return "PROD";
    if (npmEvent.includes("stage")) return "STAGE";
    return "unknown";
  }

  // Fallback: detect environment from the test suite title or file path
  private detectEnvFromSuite(suite: Suite): string {
    const checkNode = (node: Suite | TestCase): string => {
      if (node.title?.toLowerCase().includes("stage")) return "STAGE";
      if (node.title?.toLowerCase().includes("prod")) return "PROD";
      if (node.location?.file?.toLowerCase().includes("stage")) return "STAGE";
      if (node.location?.file?.toLowerCase().includes("prod")) return "PROD";
      return "unknown";
    };
    let result = checkNode(suite);
    if (result !== "unknown") return result;
    if (suite.suites) {
      for (const child of suite.suites) {
        result = this.detectEnvFromSuite(child);
        if (result !== "unknown") return result;
      }
    }
    return "unknown";
  }

  // Called when each individual test ends — capture the result
  onTestEnd(test: TestCase, result: TestResult) {
    // ---- FILTER: Skip smoke / keyboard tests so they never appear in reports ----
    const filePath = test.location.file.replace(/\\/g, "/");
    if (filePath.includes("smokeTest")) return;
    if (filePath.includes("keyboard")) return;

    // Walk up the suite tree to build the full suite path
    const title = test.title;
    const parent = this.getParentSuite(test.parent);
    const error = result.error
      ? `${result.error.message || ""}\n${result.error.stack || ""}`.trim()
      : "";

    // Extract playwright-style tags like @smoke, @regression from the test title
    const tags: string[] = [];
    const tagRegex = /@(\w+)/g;
    let match;
    while ((match = tagRegex.exec(title)) !== null) {
      tags.push(`@${match[1]}`);
    }

    const record: TestRecord = {
      testName: title,
      suiteName: parent,
      status: result.status,
      duration: result.duration,
      file: filePath.replace(process.cwd().replace(/\\/g, "/") + "/", ""),
      lineNumber: test.location.line,
      error,
      retries: result.retry,
      tags,
      timestamp: new Date().toISOString(),
      env: this.envName,
    };

    this.testRecords.push(record);
  }

  // Walk up the suite tree and build the full path
  // e.g. "Root Suite > Stage Tests > Feature Tests"
  private getParentSuite(suite: Suite | undefined): string {
    const parts: string[] = [];
    let current: Suite | undefined = suite;
    while (current && current.title) {
      parts.unshift(current.title);
      current = current.parent;
    }
    return parts.join(" > ");
  }

  // ----------------------------------------------------------
  // Called when ALL tests finish — generate daily report + accumulate monthly data
  // ----------------------------------------------------------
  async onEnd(result: FullResult) {
    // If all tests were filtered out (e.g. only smoke tests ran), skip report generation
    if (this.testRecords.length === 0) {
      console.log("   No tests recorded (all filtered out), skipping Excel report");
      return;
    }

    // Create a new Excel workbook with 3 sheets
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Playwright Excel Reporter";
    workbook.created = new Date();

    await this.addDailySheet(workbook);
    await this.addSummarySheet(workbook, result);
    await this.addFailedTestsSheet(workbook);

    // Write the daily Excel file: stage_report_2026-05-08.xlsx
    const date = new Date();
    const dateStr = date.toISOString().split("T")[0];
    const filename = `${this.envName.toLowerCase()}_report_${dateStr}.xlsx`;
    const filepath = join(this.outputDir, filename);

    const buffer = await workbook.xlsx.writeBuffer();
    writeFileSync(filepath, buffer as unknown as Buffer);

    console.log(`\n📊 Excel report generated: ${filepath}`);
    console.log(`   Total tests: ${this.testRecords.length}`);
    console.log(`   Passed: ${this.testRecords.filter((t) => t.status === "passed").length}`);
    console.log(`   Failed: ${this.testRecords.filter((t) => t.status === "failed" || t.status === "timedOut").length}`);
    console.log(`   Skipped: ${this.testRecords.filter((t) => t.status === "skipped").length}`);

    // Append to the monthly JSON file and regenerate the monthly summary Excel
    await this.appendToMonthlyJson(date, this.testRecords);
    await this.updateMonthlySummary(date);
  }

  // ----------------------------------------------------------
  // Generate / update monthly summary Excel for BOTH environments
  // (if JSON data exists for that env)
  // ----------------------------------------------------------
  private async updateMonthlySummary(date: Date) {
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthlyDir = join(this.outputDir, "monthly-data");
    // Try both environments — the monthly summary file may already exist for the other env
    const envs = ["STAGE", "PROD"];
    for (const env of envs) {
      const envFile = join(monthlyDir, `${env.toLowerCase()}_${monthStr}.json`);
      if (!existsSync(envFile)) continue;
      console.log(`📈 Updating monthly summary for ${env} - ${monthStr}...`);
      // Retry up to 3 times with 2s delay if the file is busy (EBUSY)
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await generateMonthlySummary(env, monthStr, monthlyDir, this.outputDir);
          break;
        } catch (e) {
          if ((e as NodeJS.ErrnoException).code === "EBUSY") {
            await new Promise((r) => setTimeout(r, 2000));
          } else {
            console.log(`   Monthly summary update for ${env}: ${(e as Error).message}`);
            break;
          }
        }
      }
    }
  }

  // ----------------------------------------------------------
  // Sheet 1: Daily Test Results — every test in a table row
  // ----------------------------------------------------------
  private async addDailySheet(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Daily Test Results", {
      properties: { tabColor: { argb: "FF0070C0" } },
    });

    // Define columns with widths
    sheet.columns = [
      { header: "No.", key: "no", width: 6 },
      { header: "Test Name", key: "testName", width: 50 },
      { header: "Suite", key: "suiteName", width: 40 },
      { header: "Status", key: "status", width: 14 },
      { header: "Duration (ms)", key: "duration", width: 15 },
      { header: "Duration (s)", key: "durationSec", width: 13 },
      { header: "File", key: "file", width: 45 },
      { header: "Line", key: "lineNumber", width: 8 },
      { header: "Error Message", key: "error", width: 60 },
      { header: "Retries", key: "retries", width: 10 },
      { header: "Tags", key: "tags", width: 20 },
      { header: "Timestamp", key: "timestamp", width: 22 },
      { header: "Environment", key: "env", width: 14 },
    ];

    // Style the header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0070C0" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 25;

    // Write each test record as a row
    this.testRecords.forEach((record, index) => {
      const row = sheet.addRow({
        no: index + 1,
        testName: record.testName,
        suiteName: record.suiteName,
        status: record.status.toUpperCase(),
        duration: record.duration,
        durationSec: (record.duration / 1000).toFixed(2),
        file: record.file,
        lineNumber: record.lineNumber,
        error: record.error,
        retries: record.retries,
        tags: record.tags.join(", "),
        timestamp: record.timestamp,
        env: record.env,
      });

      // Color-code the status cell
      const statusCell = row.getCell("status");
      switch (record.status) {
        case "passed":
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6EFCE" } };
          statusCell.font = { color: { argb: "FF006100" }, bold: true };
          break;
        case "failed":
        case "timedOut":
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC7CE" } };
          statusCell.font = { color: { argb: "FF9C0006" }, bold: true };
          break;
        case "skipped":
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
          statusCell.font = { color: { argb: "FF9C6500" }, bold: true };
          break;
      }

      // Add thin borders to all cells
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Add auto-filter on header row and freeze the header
    sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheet.columns.length } };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  // ----------------------------------------------------------
  // Sheet 2: Summary — high-level pass/fail metrics
  // ----------------------------------------------------------
  private async addSummarySheet(workbook: ExcelJS.Workbook, result: FullResult) {
    const sheet = workbook.addWorksheet("Summary", {
      properties: { tabColor: { argb: "FF4472C4" } },
    });

    // Calculate aggregates
    const passed = this.testRecords.filter((t) => t.status === "passed").length;
    const failed = this.testRecords.filter((t) => t.status === "failed").length;
    const timedOut = this.testRecords.filter((t) => t.status === "timedOut").length;
    const skipped = this.testRecords.filter((t) => t.status === "skipped").length;
    const total = this.testRecords.length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : "0.00";
    const totalDuration = this.testRecords.reduce((sum, t) => sum + t.duration, 0);
    const avgDuration = total > 0 ? (totalDuration / total).toFixed(2) : "0.00";

    sheet.columns = [
      { header: "Metric", key: "metric", width: 30 },
      { header: "Value", key: "value", width: 25 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };

    // Write metric-value pairs
    const summaryData = [
      ["Environment", this.envName],
      ["Test Suite", this.suiteName],
      ["Execution Date", new Date().toLocaleString()],
      ["", ""],
      ["Total Tests", total.toString()],
      ["Passed", passed.toString()],
      ["Failed", (failed + timedOut).toString()],
      ["Timed Out", timedOut.toString()],
      ["Skipped", skipped.toString()],
      ["", ""],
      ["Pass Rate", `${passRate}%`],
      ["Total Duration (s)", (totalDuration / 1000).toFixed(2)],
      ["Avg Duration (ms)", avgDuration],
      ["Retries", result.status],
    ];

    summaryData.forEach(([metric, value]) => {
      const row = sheet.addRow({ metric, value });
      if (metric) row.getCell("metric").font = { bold: true };
      row.eachCell((cell) => {
        cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
      });
    });

    // Color the last row's value cell based on overall pass/fail status
    const statusRow = sheet.lastRow;
    if (statusRow) {
      statusRow.getCell("value").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: result.status === "passed" ? "FFC6EFCE" : "FFFFC7CE" },
      };
    }
  }

  // ----------------------------------------------------------
  // Sheet 3: Failed Tests — details of each failure
  // ----------------------------------------------------------
  private async addFailedTestsSheet(workbook: ExcelJS.Workbook) {
    const failedTests = this.testRecords.filter(
      (t) => t.status === "failed" || t.status === "timedOut"
    );

    // If no failures, show a simple message sheet
    if (failedTests.length === 0) {
      const sheet = workbook.addWorksheet("Failed Tests (None)", {
        properties: { tabColor: { argb: "FFC6EFCE" } },
      });
      sheet.addRow("No failed tests!");
      return;
    }

    const sheet = workbook.addWorksheet("Failed Tests", {
      properties: { tabColor: { argb: "FFFF0000" } },
    });

    sheet.columns = [
      { header: "No.", key: "no", width: 6 },
      { header: "Test Name", key: "testName", width: 50 },
      { header: "Suite", key: "suiteName", width: 40 },
      { header: "File", key: "file", width: 45 },
      { header: "Line", key: "lineNumber", width: 8 },
      { header: "Duration (ms)", key: "duration", width: 15 },
      { header: "Retries", key: "retries", width: 10 },
      { header: "Error Details", key: "error", width: 80 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF0000" } };

    failedTests.forEach((record, index) => {
      const row = sheet.addRow({
        no: index + 1,
        testName: record.testName,
        suiteName: record.suiteName,
        file: record.file,
        lineNumber: record.lineNumber,
        duration: record.duration,
        retries: record.retries,
        error: record.error,
      });

      row.eachCell((cell) => {
        cell.alignment = { vertical: "top", wrapText: true };
        cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
      });
    });

    sheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  // ----------------------------------------------------------
  // Accumulate daily data into a monthly JSON file
  // File: test-results/excel-reports/monthly-data/{env}_YYYY-MM.json
  // JSON structure: array of arrays — each inner array is one day's TestRecord[]
  // ----------------------------------------------------------
  private async appendToMonthlyJson(date: Date, records: TestRecord[]) {
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthlyDir = join(this.outputDir, "monthly-data");
    mkdirSync(monthlyDir, { recursive: true });

    const monthlyFile = join(monthlyDir, `${this.envName.toLowerCase()}_${monthStr}.json`);

    // Load existing monthly data or start fresh
    let monthlyData: TestRecord[][] = [];
    if (existsSync(monthlyFile)) {
      monthlyData = JSON.parse(readFileSync(monthlyFile, "utf-8"));
    }

    // Append today's records and save
    monthlyData.push(records);
    writeFileSync(monthlyFile, JSON.stringify(monthlyData, null, 2));
  }
}

export default ExcelReporter;
