const fs = require('fs');
const WDIOReporter = require('@wdio/reporter').default;

class CsvReporter extends WDIOReporter {
    constructor(options) {
        super(options);

        this.outputFile = options.outputFile || 'test-result.csv';
        this.suites = {}; // { suiteName: { passed: n, failed: n } }

        // CSV Header
        fs.writeFileSync(
            this.outputFile,
            "Test Name,Status,Start Time,End Time,Duration(s),Error Message\n",
            'utf8'
        );
    }

    onSuiteStart(suite) {
        if (suite.title) {
            // Ghi tên suite như một dòng header trước khi ghi các test
            const suiteHeader = `\n=== ${suite.title} ===\n`;
            fs.appendFileSync(this.outputFile, suiteHeader, 'utf8');

            // Khởi tạo bộ đếm cho suite
            this.suites[suite.title] = { passed: 0, failed: 0 };
        }
    }

    onTestStart(test) {
        test._startTime = Date.now();
    }

    onTestEnd(test) {
        const start = test._startTime || Date.now();
        const end = Date.now();
        const duration = end - start;

        const startStr = new Date(start).toISOString();
        const endStr = new Date(end).toISOString();

        const status = test.state || "unknown";
        const errorMessage = test.error
            ? `"${test.error.message.replace(/"/g, "'")}"`
            : "";

        const suiteName = test.parent || "Unknown Suite";
        if (!this.suites[suiteName]) this.suites[suiteName] = { passed: 0, failed: 0 };
        if (status === 'passed') this.suites[suiteName].passed++;
        if (status === 'failed') this.suites[suiteName].failed++;

        const row = `${test.title},${status},${startStr},${endStr},${duration / 1000},${errorMessage}\n`;
        fs.appendFileSync(this.outputFile, row, 'utf8');
    }

    onSuiteEnd(suite) {
        const counts = this.suites[suite.title];
        if (!counts) return;

        const total = counts.passed + counts.failed;
        const passRatio = total ? ((counts.passed / total) * 100).toFixed(2) : 0;
        const failRatio = total ? ((counts.failed / total) * 100).toFixed(2) : 0;

        const summaryRow = `TOTAL,PASS/FAIL RATIO,,,${counts.passed}/${total} (${passRatio}%) / ${counts.failed}/${total} (${failRatio}%)\n\n`;
        fs.appendFileSync(this.outputFile, summaryRow, 'utf8');
    }

}

module.exports = CsvReporter;
