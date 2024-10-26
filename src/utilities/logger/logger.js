"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var winston_1 = require("winston");
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, label = winston_1.format.label, printf = winston_1.format.printf;
var myFormat = printf(function (_a) {
    var level = _a.level, message = _a.message, label = _a.label, timestamp = _a.timestamp;
    var date = new Date(timestamp);
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return "{".concat(date.toDateString(), " ").concat(hour, ":").concat(minute, ":").concat(second, ":").concat(milliseconds, "} [").concat(label, "] ").concat(level, ": ").concat(message);
});
var console = (0, winston_1.createLogger)({
    level: "info",
    format: combine(label({ label: "WeeURL" }), timestamp(), myFormat),
    transports: [new winston_1.transports.Console()],
});
exports.logger = {
    console: console,
};
