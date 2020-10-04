"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "typed", {
  enumerable: true,
  get: function () {
    return _typed().default;
  }
});
Object.defineProperty(exports, "stacktrace", {
  enumerable: true,
  get: function () {
    return _stacktrace.stacktrace;
  }
});
exports.timeout = exports.setOwnProps = exports.setOwnProp = exports.eachAsync = exports.each = exports.inObj = exports.inArr = exports.getOwnProps = exports.getOwnPropNames = exports.getOwnProp = exports.hasOwnProp = exports.getPrototype = exports.isObjStrict = exports.isArrStrict = exports.isPromise = exports.isFunc = exports.isBool = exports.isSymb = exports.isStr = exports.isNum = exports.isObj = exports.isArr = exports.isVoid = exports.entries = exports.values = exports.keys = exports.noop = void 0;

function _typed() {
  const data = _interopRequireDefault(require("@wareset/typed"));

  _typed = function () {
    return data;
  };

  return data;
}

var _stacktrace = require("./stacktrace.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const noop = () => {};

exports.noop = noop;
const keys = Object.keys;
exports.keys = keys;

const values = v => keys(v).map(k => v[k]);

exports.values = values;

const entries = v => keys(v).map(k => [k, v[k]]);

exports.entries = entries;

const isVoid = v => v == null;

exports.isVoid = isVoid;
const isArr = Array.isArray;
exports.isArr = isArr;

const isObj = v => typeof v === 'object';

exports.isObj = isObj;

const isNum = v => typeof v === 'number';

exports.isNum = isNum;

const isStr = v => typeof v === 'string';

exports.isStr = isStr;

const isSymb = v => typeof v === 'symbol';

exports.isSymb = isSymb;

const isBool = v => typeof v === 'boolean';

exports.isBool = isBool;

const isFunc = v => typeof v === 'function';

exports.isFunc = isFunc;

const isPromise = v => v instanceof Promise;

exports.isPromise = isPromise;

const isArrStrict = v => (0, _typed().default)(v) === Array;

exports.isArrStrict = isArrStrict;

const isObjStrict = v => (0, _typed().default)(v) === Object;

exports.isObjStrict = isObjStrict;

const getPrototype = Object.getPrototypeOf || (v => v.__proto__);

exports.getPrototype = getPrototype;

const hasOwnProp = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

exports.hasOwnProp = hasOwnProp;
const getOwnProp = Object.getOwnPropertyDescriptor;
exports.getOwnProp = getOwnProp;
const getOwnPropNames = Object.getOwnPropertyNames;
exports.getOwnPropNames = getOwnPropNames;

const getOwnProps = // Object.getOwnPropertyDescriptors ||
o => {
  const res = {};
  getOwnPropNames(o).forEach(k => res[k] = getOwnProp(o, k));
  return res;
};

exports.getOwnProps = getOwnProps;

const inArr = (obj, v, k) => obj.indexOf(v, k || 0) + 1;

exports.inArr = inArr;

const inObj = (obj, v, k) => {
  if (!isObj(obj)) throw new TypeError(obj);
  if (_typed().default.of(obj, Array)) return inArr(obj, v, k);
  if (_typed().default.of(obj, Set, WeakSet, Map, WeakMap)) return obj.has(v);
  return keys(obj).indexOf(v, k || 0) + 1;
};

exports.inObj = inObj;

const each = (obj, cb) => {
  if (!obj || !isObj(obj)) throw new TypeError(obj);
  let k = 0;

  if (_typed().default.of(obj, Array, Set, WeakSet)) {
    for (const v of obj) cb(v, k, obj), k++;

    return;
  }

  if (_typed().default.of(obj, Map, WeakMap)) {
    for (const [k, v] of obj) cb(v, k, obj);

    return;
  }

  for (const k of keys(obj)) cb(obj[k], k, obj);
};

exports.each = each;

const eachAsync = async (obj, cb) => {
  if (!obj || !isObj(obj)) throw new TypeError(obj);
  let k = 0;

  if (_typed().default.of(obj, Array, Set, WeakSet)) {
    for await (const v of obj) await cb(v, k, obj), k++;

    return;
  }

  if (_typed().default.of(obj, Map, WeakMap)) {
    for await (const [k, v] of obj) await cb(v, k, obj);

    return;
  }

  for await (const k of keys(obj)) await cb(obj[k], k, obj);
};

exports.eachAsync = eachAsync;

const setOwnProp = (object, ...args) => {
  const define = (...args) => {
    if (args.length) {
      let [key, props, writable, enumerable] = args;
      if (!isObjStrict(props)) props = {
        value: props
      };
      props = {
        enumerable: !!enumerable,
        configurable: true,
        writable: true,
        ...props
      };
      if (props.get || props.set) delete props.writable;else if (writable !== undefined) props.writable = !!writable;
      Object.defineProperty(object, key, props);
    }

    return define;
  };

  return define(...args);
};

exports.setOwnProp = setOwnProp;

const setOwnProps = (object, props) => {
  const define = setOwnProp(object);

  const defines = props => {
    if (props) each(props, (v, k) => define(k, v));
    return defines;
  };

  return defines(props);
};

exports.setOwnProps = setOwnProps;

const timeout = (time, cb) => {
  time = time || 0, cb = cb || noop;
  return new Promise(resolve => setTimeout(() => resolve(cb()), time));
};

exports.timeout = timeout;