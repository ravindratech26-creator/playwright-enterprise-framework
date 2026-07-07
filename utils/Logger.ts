import * as fs from 'fs';
import * as path from 'path';
import { TestContext } from './TestContext';

export class Logger {

    // Log file location
    private static readonly logFilePath = path.join(
        process.cwd(),
        'logs',
        'framework.log'
    );

    // Generate current timestamp
    private static getTimeStamp(): string {
        return new Date().toLocaleString();
    }

    // Common method to write logs
    private static writeLog(level: string, message: string): void {

        const testName = TestContext.getTestName() || 'Unknown Test';

        const logMessage =
            `${this.getTimeStamp()} [${level}] [${testName}] ${message}\n`;

        // Print to console
        console.log(logMessage);

        // Create logs folder if it doesn't exist
        fs.mkdirSync(path.dirname(this.logFilePath), {
            recursive: true
        });

        // Append log to framework.log
        fs.appendFileSync(
            this.logFilePath,
            logMessage,
            'utf8'
        );
    }

    static info(message: string): void {
        this.writeLog('INFO', message);
    }

    static success(message: string): void {
        this.writeLog('SUCCESS', message);
    }

    static warn(message: string): void {
        this.writeLog('WARN', message);
    }

    static error(message: string): void {
        this.writeLog('ERROR', message);
    }

}