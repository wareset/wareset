"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setOwnProps = exports.setOwnProp = exports.eachAsync = exports.each = exports.inObj = exports.inArr = exports.getOwnProps = exports.getOwnPropNames = exports.getOwnProp = exports.hasOwnProp = exports.getPrototype = exports.isObjStrict = exports.isArrStrict = exports.isFunc = exports.isBool = exports.isSymb = exports.isStr = exports.isNum = exports.isObj = exports.isArr = exports.isVoid = exports.noop = void 0;

function _typed() {
  const data = _interopRequireDefault(require("@wareset/typed"));

  _typed = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const noop = () => {};

exports.noop = noop;

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

const getOwnProps = o => {
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
  return Object.keys(obj).indexOf(v, k || 0) + 1;
};

exports.inObj = inObj;

const each = (obj, cb) => {
  if (!isObj(obj)) throw new TypeError(obj);
  let k = 0;

  if (_typed().default.of(obj, Array, Set, WeakSet)) {
    for (const v of obj) cb(v, k, obj), k++;

    return;
  }

  if (_typed().default.of(obj, Map, WeakMap)) {
    for (const [k, v] of obj) cb(v, k, obj);

    return;
  }

  for (const k of Object.keys(obj)) cb(obj[k], k, obj);
};

exports.each = each;

const eachAsync = async (obj, cb) => {
  if (!isObj(obj)) throw new TypeError(obj);
  let k = 0;

  if (_typed().default.of(obj, Array, Set, WeakSet)) {
    for await (const v of obj) await cb(v, k, obj), k++;

    return;
  }

  if (_typed().default.of(obj, Map, WeakMap)) {
    for await (const [k, v] of obj) await cb(v, k, obj);

    return;
  }

  for await (const k of Object.keys(obj)) await cb(obj[k], k, obj);
};

exports.eachAsync = eachAsync;

const setOwnProp = (object, key, props, writable, enumerable) => {
  const define = (key, props, writable) => {
    if (key !== undefined) {
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

  return define(key, props, writable);
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