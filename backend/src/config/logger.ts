type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const minLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minLevel];
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, any>): string {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
  if (meta && Object.keys(meta).length > 0) {
    return `${base} ${JSON.stringify(meta)}`;
  }
  return base;
}

export const logger = {
  debug(message: string, meta?: Record<string, any>): void {
    if (shouldLog('debug')) console.debug(formatMessage('debug', message, meta));
  },
  info(message: string, meta?: Record<string, any>): void {
    if (shouldLog('info')) console.log(formatMessage('info', message, meta));
  },
  warn(message: string, meta?: Record<string, any>): void {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, meta));
  },
  error(message: string, meta?: Record<string, any>): void {
    if (shouldLog('error')) console.error(formatMessage('error', message, meta));
  },
};
