import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return `{${date.toDateString()} ${hour}:${minute}:${second}:${milliseconds}} [${label}] ${level}: ${message}`;
});

const console = createLogger({
  level: "info",
  format: combine(label({ label: "WeeURL" }), timestamp(), myFormat),
  transports: [new transports.Console()],
});

export const logger = {
  console,
};
