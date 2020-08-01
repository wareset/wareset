const typed = require('@wareset/typed');

module.exports = function equal(a, b, deep = true) {
  if (a === b) return true;
  if (typeof a !== 'object') return a !== a && b !== b;

  const proto = typed(a);
  if (!typed(b, proto)) return false;

  const deep2 = typeof deep !== 'number' ? deep : deep <= 0 ? 0 : deep--;

  let keys;
  switch (proto) {
    case Object.prototype:
      keys = Object.keys(a);
      if (keys.length !== Object.keys(b).length) return false;
      return !keys.some(k => {
        return deep ? !equal(a[k], b[k], deep2) : a[k] !== b[k];
      });

    case Array.prototype:
      if (a.length !== b.length) return false;
      return !a.some((v, k) => {
        return deep ? !equal(a[k], b[k], deep2) : a[k] !== b[k];
      });

    case Map.prototype:
      if (a.size !== b.size) return false;
      for (const [k, v] of a) {
        if (!b.has(k) || deep ? !equal(v, b.get(k), deep2) : v !== b.get(k)) {
          return false;
        }
      }
      return true;

    case Set.prototype:
      if (a.size !== b.size) return false;
      for (const v of a) if (!b.has(v)) return false;
      return true;

    case RegExp.prototype:
      return a.source === b.source && a.flags === b.flags;

    default:
      if (ArrayBuffer.isView(a)) {
        if (a.length !== b.length) return false;
        for (let i = a.length; i !== 0; i--) if (a[i] !== b[i]) return false;
        return true;
      }
      if (a.valueOf !== Object.prototype.valueOf) {
        return a.valueOf() === b.valueOf();
      }
      if (a.toString !== Object.prototype.toString) {
        return a.toString() === b.toString();
      }
      return false;
  }
};
