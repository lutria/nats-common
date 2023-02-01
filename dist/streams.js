"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_STREAM_PREFIX = void 0;
var nats_1 = require("nats");
exports.EVENT_STREAM_PREFIX = "events";
exports.default = [
  {
    name: "EVENTS",
    retention: nats_1.RetentionPolicy.Workqueue,
    subjects: ["".concat(exports.EVENT_STREAM_PREFIX, ".>")],
  },
];
