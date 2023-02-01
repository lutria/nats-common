"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var nats_1 = require("nats");
var streams_1 = __importDefault(require("./streams"));
var NatsClient = /** @class */ (function () {
  function NatsClient(_a) {
    var logger = _a.logger,
      name = _a.name,
      servers = _a.servers;
    this.logger = logger;
    this.name = name;
    this.servers = servers;
    this.jsonCodec = (0, nats_1.JSONCodec)();
  }
  NatsClient.prototype.connect = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _a, jsm, _i, streams_2, stream;
      var _this = this;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _a = this;
            return [
              4 /*yield*/,
              (0, nats_1.connect)({
                name: this.name,
                servers: this.servers.split(","),
              }),
            ];
          case 1:
            _a.nc = _b.sent();
            this.nc.closed().then(function (err) {
              if (err) {
                _this.logger.error(
                  "Client "
                    .concat(_this.name, " exited because of error: ")
                    .concat(err.message)
                );
              }
            });
            return [4 /*yield*/, this.nc.jetstreamManager()];
          case 2:
            jsm = _b.sent();
            (_i = 0), (streams_2 = streams_1.default);
            _b.label = 3;
          case 3:
            if (!(_i < streams_2.length)) return [3 /*break*/, 6];
            stream = streams_2[_i];
            // Add/create the stream
            return [4 /*yield*/, jsm.streams.add(stream)];
          case 4:
            // Add/create the stream
            _b.sent();
            this.logger.info("Created stream with name: ".concat(stream.name));
            _b.label = 5;
          case 5:
            _i++;
            return [3 /*break*/, 3];
          case 6:
            // Access the JetStream client for publishing and subscribing to streams.
            this.js = this.nc.jetstream();
            return [2 /*return*/];
        }
      });
    });
  };
  NatsClient.prototype.disconnect = function () {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            // Finally we drain the connection which waits for any pending
            // messages (published or in a subscription) to be flushed.
            return [
              4 /*yield*/,
              (_a = this.nc) === null || _a === void 0 ? void 0 : _a.drain(),
            ];
          case 1:
            // Finally we drain the connection which waits for any pending
            // messages (published or in a subscription) to be flushed.
            _c.sent();
            return [
              4 /*yield*/,
              (_b = this.nc) === null || _b === void 0 ? void 0 : _b.close(),
            ];
          case 2:
            _c.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  NatsClient.prototype.publish = function (subject, data) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            // Publish a series of messages and wait for each one to be completed.
            return [
              4 /*yield*/,
              (_a = this.js) === null || _a === void 0
                ? void 0
                : _a.publish(subject, this.jsonCodec.encode(data)),
            ];
          case 1:
            // Publish a series of messages and wait for each one to be completed.
            _b.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  NatsClient.prototype.subscribe = function (subject, queue, handler) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
      var handleMessage, sub;
      var _this = this;
      return __generator(this, function (_b) {
        handleMessage = function (s) {
          var _a, s_1, s_1_1;
          return __awaiter(_this, void 0, void 0, function () {
            var m, data, e_1_1;
            var _b, e_1, _c, _d;
            return __generator(this, function (_e) {
              switch (_e.label) {
                case 0:
                  _e.trys.push([0, 5, 6, 11]);
                  (_a = true), (s_1 = __asyncValues(s));
                  _e.label = 1;
                case 1:
                  return [4 /*yield*/, s_1.next()];
                case 2:
                  if (!((s_1_1 = _e.sent()), (_b = s_1_1.done), !_b))
                    return [3 /*break*/, 4];
                  _d = s_1_1.value;
                  _a = false;
                  try {
                    m = _d;
                    data = this.jsonCodec.decode(m.data);
                    handler(data);
                  } finally {
                    _a = true;
                  }
                  _e.label = 3;
                case 3:
                  return [3 /*break*/, 1];
                case 4:
                  return [3 /*break*/, 11];
                case 5:
                  e_1_1 = _e.sent();
                  e_1 = { error: e_1_1 };
                  return [3 /*break*/, 11];
                case 6:
                  _e.trys.push([6, , 9, 10]);
                  if (!(!_a && !_b && (_c = s_1.return)))
                    return [3 /*break*/, 8];
                  return [4 /*yield*/, _c.call(s_1)];
                case 7:
                  _e.sent();
                  _e.label = 8;
                case 8:
                  return [3 /*break*/, 10];
                case 9:
                  if (e_1) throw e_1.error;
                  return [7 /*endfinally*/];
                case 10:
                  return [7 /*endfinally*/];
                case 11:
                  return [2 /*return*/];
              }
            });
          });
        };
        sub =
          (_a = this.nc) === null || _a === void 0
            ? void 0
            : _a.subscribe(subject, { queue: queue });
        if (sub) {
          handleMessage(sub);
        } else {
          throw new Error("Failed to create subscription");
        }
        return [2 /*return*/];
      });
    });
  };
  return NatsClient;
})();
exports.default = NatsClient;
