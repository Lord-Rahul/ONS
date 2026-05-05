import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const getLogFileName = (level) => {
  const date = new Date().toISOString().split('T')[0];
  return path.join(logsDir, `${level.toLowerCase()}-${date}.log`);
};

const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
  return `[${timestamp}] [${level}] ${message} ${metaStr}\n`;
};

const logger = {
  error: (message, meta = {}) => {
    const logMessage = formatLogMessage(LOG_LEVELS.ERROR, message, meta);
    console.error(logMessage);
    fs.appendFileSync(getLogFileName(LOG_LEVELS.ERROR), logMessage);
  },
  
  warn: (message, meta = {}) => {
    const logMessage = formatLogMessage(LOG_LEVELS.WARN, message, meta);
    console.warn(logMessage);
    fs.appendFileSync(getLogFileName(LOG_LEVELS.WARN), logMessage);
  },
  
  info: (message, meta = {}) => {
    const logMessage = formatLogMessage(LOG_LEVELS.INFO, message, meta);
    console.log(logMessage);
    fs.appendFileSync(getLogFileName(LOG_LEVELS.INFO), logMessage);
  },
  
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      const logMessage = formatLogMessage(LOG_LEVELS.DEBUG, message, meta);
      console.log(logMessage);
      fs.appendFileSync(getLogFileName(LOG_LEVELS.DEBUG), logMessage);
    }
  }
};

export default logger;
