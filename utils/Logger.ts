import * as fs from 'fs';
import * as path from 'path';
import winston from 'winston';
import { TestContext } from './TestContext';

const logsDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        success: 2,
        info: 3,
        debug: 4
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        success: 'green',
        info: 'blue',
        debug: 'magenta'
    }
};

winston.addColors(customLevels.colors);

const withTestName = winston.format((info) => {
    info.testName = TestContext.getTestName() || 'Unknown Test';
    return info;
});

const logFormat = winston.format.printf(
    ({ timestamp, level, message, testName }) => `${timestamp} [${level}] [${testName}] ${message}`
);

const winstonLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                withTestName(),
                winston.format.timestamp(),
                winston.format.colorize({ all: true }),
                logFormat
            )
        }),
        new winston.transports.File({
            filename: path.join(logsDir, 'framework.log'),
            format: winston.format.combine(withTestName(), winston.format.timestamp(), logFormat)
        })
    ]
});

export class Logger {
    static info(message: string): void {
        winstonLogger.log('info', message);
    }

    static success(message: string): void {
        winstonLogger.log('success', message);
    }

    static warn(message: string): void {
        winstonLogger.log('warn', message);
    }

    static error(message: string): void {
        winstonLogger.log('error', message);
    }
}
