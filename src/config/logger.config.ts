import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logDir = 'logs';

const fileRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logDir, 'estadosimss-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(format.timestamp(), format.json()),
});

const winstonLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'estrados-imss-service' },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    fileRotateTransport,
  ],
});

export const logger = {
  log: (message: string) => winstonLogger.info(message),
  error: (message: string, trace?: string) =>
    winstonLogger.error(message, { trace }),
  warn: (message: string) => winstonLogger.warn(message),
  debug: (message: string) => winstonLogger.debug(message),
  verbose: (message: string) => winstonLogger.verbose(message),
};
