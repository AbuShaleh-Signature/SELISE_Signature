import { Reporter, FullConfig, Suite, TestCase, TestResult, TestStep, FullResult } from "@playwright/test/reporter";
import ExcelJS from "exceljs";
import { join, dirname } from "path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";

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

class ExcelReporter implements Reporter {
  private testRecords: TestRecord[] = [];
  private suiteName: string = "";
  private outputDir: string;
  private envName: string = "unknown";

  constructor(options: { outputDir?: string; env?: string } = {}) {
    this.outputDir = options.outputDir || "test-results/excel-reports";
    this.envName = options.env || this.detectEnv();
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.suiteName = suite.title || "Test Suite";
    if (this.envName === "unknown") {
      this.envName = this.detectEnvFromSuite(suite);
    }
    mkdirSync(this.outputDir, { recursive: true });
  }

  private detectEnv(): string {
    if (process.env.TEST_ENV) return process.env.TEST_ENV.toUpperCase();
    const npmEvent = process.env.npm_lifecycle_event || "";
    if (npmEvent.includes("prod")) return "PROD";
    if (npmEvent.includes("stage")) return "STAGE";
    return "unknown";
  }

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

  onTestEnd(test: TestCase, result: TestResult) {
    const title = test.title;
    const parent = this.getParentSuite(test.parent);
    const error = result.error
      ? `${result.error.message || ""}\n${result.error.stack || ""}`.trim()
      : "";

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
      file: test.location.file.replace(process.cwd(), "").replace(/^[\\/]/, ""),
      lineNumber: test.location.line,
      error,
      retries: result.retry,
      tags,
      timestamp: new Date().toISOString(),
      env: this.envName,
    };

    this.testRecords.push(record);
  }

  private getParentSuite(suite: Suite | undefined): string {
    const parts: string[] = [];
    let current: Suite | undefined = suite;
    while (current && current.title) {
      parts.unshift(current.title);
      current = current.parent;
    }
    return parts.join(" > ");
  }

  async onEnd(result: FullResult) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Playwright Excel Reporter";
    workbook.created = new Date();

    await this.addDailySheet(workbook);
    await this.addSummarySheet(workbook, result);
    await this.addFailedTestsSheet(workbook);

    const date = new Date();
    const dateStr = date.toISOString().split("T")[0];
    const filename = `${this.envName.toLowerCase()}_report_${dateStr}.xlsx`;
    const filepath = join(this.outputDir, filename);

    const buffer = await workbook.xlsx.writeBuffer();
    writeFileSync(filepath, buffer as Buffer);

    console.log(`\n📊 Excel report generated: ${filepath}`);
    console.log(`   Total tests: ${this.testRecords.length}`);
    console.log(`   Passed: ${this.testRecords.filter((t) => t.status === "passed").length}`);
    console.log(`   Failed: ${this.testRecords.filter((t) => t.status === "failed" || t.status === "timedOut").length}`);
    console.log(`   Skipped: ${this.testRecords.filter((t) => t.status === "skipped").length}`);

    await this.appendToMonthlyJson(date, this.testRecords);
  }

  private async addDailySheet(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Daily Test Results", {
      properties: { tabColor: { argb: "FF0070C0" } },
    });

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

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0070C0" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 25;

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

      const statusCell = row.getCell("status");
      switch (record.status) {
        case "passed":
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFC6EFCE" },
          };
          statusCell.font = { color: { argb: "FF006100" }, bold: true };
          break;
        case "failed":
        case "timedOut":
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFC7CE" },
          };
          statusCell.font = { color: { argb: "FF9C0006" }, bold: true };
          break;
        case "skipped":
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFF2CC" },
          };
          statusCell.font = { color: { argb: "FF9C6500" }, bold: true };
          break;
      }

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

    sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheet.columns.length } };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  private async addSummarySheet(workbook: ExcelJS.Workbook, result: FullResult) {
    const sheet = workbook.addWorksheet("Summary", {
      properties: { tabColor: { argb: "FF4472C4" } },
    });

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
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };

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
      if (metric) {
        row.getCell("metric").font = { bold: true };
      }
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const statusRow = sheet.lastRow;
    if (statusRow) {
      statusRow.getCell("value").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: result.status === "passed" ? "FFC6EFCE" : "FFFFC7CE" },
      };
    }
  }

  private async addFailedTestsSheet(workbook: ExcelJS.Workbook) {
    const failedTests = this.testRecords.filter(
      (t) => t.status === "failed" || t.status === "timedOut"
    );

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
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF0000" },
    };

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
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    sheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  private async appendToMonthlyJson(date: Date, records: TestRecord[]) {
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthlyDir = join(this.outputDir, "monthly-data");
    mkdirSync(monthlyDir, { recursive: true });

    const monthlyFile = join(monthlyDir, `${this.envName.toLowerCase()}_${monthStr}.json`);

    let monthlyData: TestRecord[][] = [];
    if (existsSync(monthlyFile)) {
      monthlyData = JSON.parse(readFileSync(monthlyFile, "utf-8"));
    }

    monthlyData.push(records);
    writeFileSync(monthlyFile, JSON.stringify(monthlyData, null, 2));
  }
}

export default ExcelReporter;
