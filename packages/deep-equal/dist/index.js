"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deepEqual;

const getPrototypeOf = Object.getPrototypeOf || (v => v.__proto__);

const objProto = Object.prototype;

function deepEqual(a, b, deep = true) {
  if (a === b) return true;

  if (!deep || deep < 0 || !a || !b || typeof a !== 'object' || typeof b !== 'object') {
    return a !== a && b !== b;
  }

  const proto = getPrototypeOf(a);
  if (proto !== getPrototypeOf(b)) return false;
  const deep2 = typeof deep !== 'number' ? deep : deep--;
  let keys;

  switch (proto.constructor) {
    case Object:
      keys = Object.keys(a);
      if (keys.length !== Object.keys(b).length) return false;

      for (let k = keys.length; k-- > 0; undefined) {
        if (!objProto.hasOwnProperty.call(b, keys[k])) return false;
      }

      for (let k = keys.length; k-- > 0; undefined) {
        if (!deepEqual(a[keys[k]], b[keys[k]], deep2)) return false;
      }

      return true;

    case Array:
      if (a.length !== b.length) return false;

      for (let k = a.length; k-- > 0; undefined) {
        if (!deepEqual(a[k], b[k], deep2)) return false;
      }

      return true;

    case Map:
      if (a.size !== b.size) return false;

      for (const [k] of a) if (!b.has(k)) return false;

      for (const [k, v] of a) if (!deepEqual(v, b.get(k), deep2)) return false;

      return true;

    case Set:
      if (a.size !== b.size) return false;

      for (const v of a) if (!b.has(v)) return false;

      return true;

    case RegExp:
      return a.source === b.source && a.flags === b.flags;

    default:
      if (ArrayBuffer.isView(a)) {
        if (a.length !== b.length) return false;

        for (let k = a.length; k-- > 0; undefined) {
          if (a[k] !== b[k]) return false;
        }

        return true;
      }

      if (a.valueOf && a.valueOf !== objProto.valueOf) {
        return b.valueOf && deepEqual(a.valueOf(), b.valueOf(), deep2);
      }

      if (a.toString && a.toString !== objProto.toString) {
        return b.toString && deepEqual(a.toString(), b.toString(), deep2);
      }

      return false;
  }
}