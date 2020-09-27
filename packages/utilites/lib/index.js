"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  noop: true,
  inArr: true,
  forIn: true,
  each: true,
  define: true
};
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function () {
    return _each.default;
  }
});
Object.defineProperty(exports, "define", {
  enumerable: true,
  get: function () {
    return _define.default;
  }
});
exports.forIn = exports.inArr = exports.noop = void 0;

var _base = require("./base");

Object.keys(_base).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _base[key];
    }
  });
});

var _each = _interopRequireDefault(require("./each"));

var _define = _interopRequireDefault(require("./define"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const noop = () => {};

exports.noop = noop;

const inArr = (arr, v, k) => arr.indexOf(v, k || 0) !== -1;

exports.inArr = inArr;

const forIn = (obj, cb) => {
  Object.keys(obj).forEach(k => cb(obj[k], k, obj));
};

exports.forIn = forIn;