const winston = require('winston');
const expressWinston = require('express-winston');
const fs = require('fs');
const path = require('path');

const logDir = 'log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// ЛОГГЕР ЗАПРОСОВ
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logDir, '/log.txt') }),
  ],
  format: winston.format.json(),
});

// ЛОГГЕР ОШИБОК
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logDir, '/log.txt') }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
