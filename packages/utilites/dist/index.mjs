import typed from '@wareset/typed';
export { typed };
export { stacktrace } from './stacktrace.mjs';
export const noop = () => {};
export const keys = Object.keys;
export const values = v => keys(v).map(k => v[k]);
export const entries = v => keys(v).map(k => [k, v[k]]);
export const isVoid = v => v == null;
export const isArr = Array.isArray;
export const isObj = v => typeof v === 'object';
export const isNum = v => typeof v === 'number';
export const isStr = v => typeof v === 'string';
export const isSymb = v => typeof v === 'symbol';
export const isBool = v => typeof v === 'boolean';
export const isFunc = v => typeof v === 'function';
export const isPromise = v => v instanceof Promise;
export const isArrStrict = v => typed(v) === Array;
export const isObjStrict = v => typed(v) === Object;
export const getPrototype = Object.getPrototypeOf || (v => v.__proto__);
export const hasOwnProp = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
export const getOwnProp = Object.getOwnPropertyDescriptor;
export const getOwnPropNames = Object.getOwnPropertyNames;
export const getOwnProps = // Object.getOwnPropertyDescriptors ||
o => {
  const res = {};
  getOwnPropNames(o).forEach(k => res[k] = getOwnProp(o, k));
  return res;
};
export const inArr = (obj, v, k) => obj.indexOf(v, k || 0) + 1;
export const inObj = (obj, v, k) => {
  if (!isObj(obj)) throw new TypeError(obj);
  if (typed.of(obj, Array)) return inArr(obj, v, k);
  if (typed.of(obj, Set, WeakSet, Map, WeakMap)) return obj.has(v);
  return keys(obj).indexOf(v, k || 0) + 1;
};
export const each = (obj, cb) => {
  if (!obj || !isObj(obj)) throw new TypeError(obj);
  let k = 0;

  if (typed.of(obj, Array, Set, WeakSet)) {
    for (const v of obj) cb(v, k, obj), k++;

    return;
  }

  if (typed.of(obj, Map, WeakMap)) {
    for (const [k, v] of obj) cb(v, k, obj);

    return;
  }

  for (const k of keys(obj)) cb(obj[k], k, obj);
};
export const eachAsync = async (obj, cb) => {
  if (!obj || !isObj(obj)) throw new TypeError(obj);
  let k = 0;

  if (typed.of(obj, Array, Set, WeakSet)) {
    for await (const v of obj) await cb(v, k, obj), k++;

    return;
  }

  if (typed.of(obj, Map, WeakMap)) {
    for await (const [k, v] of obj) await cb(v, k, obj);

    return;
  }

  for await (const k of keys(obj)) await cb(obj[k], k, obj);
};
export const setOwnProp = (object, ...args) => {
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
export const setOwnProps = (object, props) => {
  const define = setOwnProp(object);

  const defines = props => {
    if (props) each(props, (v, k) => define(k, v));
    return defines;
  };

  return defines(props);
};
export const timeout = (time, cb) => {
  time = time || 0, cb = cb || noop;
  return new Promise(resolve => setTimeout(() => resolve(cb()), time));
};