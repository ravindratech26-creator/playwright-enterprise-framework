import * as fs from 'fs';
import * as path from 'path';

export class Logger {

    private static readonly logFilePath =
        path.join(process.cwd(), 'logs', 'framework.log');

    private static getTimeStamp(): string {
        return new Date().toLocaleString();
    }

    private static writeLog(level: string, message: string): void {

        const logMessage =
            `${this.getTimeStamp()} [${level}] ${message}\n`;

        console.log(logMessage);

        // Create logs folder if it doesn't exist
        fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });

        // Append log to file
        fs.appendFileSync(this.logFilePath, logMessage);
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