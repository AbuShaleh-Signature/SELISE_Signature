import winston from "winston";

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.File({
      filename: "logs/info.log",
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      level: "info",
    }),
    new winston.transports.Console({
      level: "error",
    }),
  ],
};

export const logger = winston.createLogger(options);
