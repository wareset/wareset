"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "isVoid", {
  enumerable: true,
  get: function () {
    return _base.isVoid;
  }
});
Object.defineProperty(exports, "getProto", {
  enumerable: true,
  get: function () {
    return _base.getProto;
  }
});
Object.defineProperty(exports, "getCtor", {
  enumerable: true,
  get: function () {
    return _base.getCtor;
  }
});
Object.defineProperty(exports, "has", {
  enumerable: true,
  get: function () {
    return _base.has;
  }
});
Object.defineProperty(exports, "isArr", {
  enumerable: true,
  get: function () {
    return _base.isArr;
  }
});
Object.defineProperty(exports, "isObj", {
  enumerable: true,
  get: function () {
    return _base.isObj;
  }
});
Object.defineProperty(exports, "isNum", {
  enumerable: true,
  get: function () {
    return _base.isNum;
  }
});
Object.defineProperty(exports, "isStr", {
  enumerable: true,
  get: function () {
    return _base.isStr;
  }
});
Object.defineProperty(exports, "isBool", {
  enumerable: true,
  get: function () {
    return _base.isBool;
  }
});
Object.defineProperty(exports, "isFunc", {
  enumerable: true,
  get: function () {
    return _base.isFunc;
  }
});
Object.defineProperty(exports, "isSymb", {
  enumerable: true,
  get: function () {
    return _base.isSymb;
  }
});
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