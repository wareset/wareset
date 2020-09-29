const getProto = Object.getPrototypeOf || (v => v.__proto__);

const getPrototypeOf = v => v == null ? v : getProto(v);

const getCtor = v => (v = getPrototypeOf(v)) ? v.constructor : v;

const getCtors = v => {
  const protos = [];

  do v = getPrototypeOf(v), protos.push(v ? v.constructor : v); while (v);

  return protos;
};

const eq = (a, b) => a === b || a === getCtor(b) && (!b.prototype || typeof b !== 'function');

const isArr = v => getCtor(v) === Array;

const cases = t => isArr(t[0]) && t[0].length ? [...t.shift(), ...t] : t;

const check = fn => (value, ...a) => {
  if (a.length && !fn(value, ...a)) throw new TypeError(value, a);
  return value;
};

function typedof(value, ...t) {
  const ctors = getCtors(value);
  if (!t.length) return ctors;
  const types = cases(t);
  return ctors.some(ctor => types.some(t => eq(ctor, t)));
}

typedof.check = check(typedof);
export default function typed(value, ...t) {
  const ctor = getCtor(value);
  return !t.length ? ctor : cases(t).some(t => eq(ctor, t));
}
typed.check = check(typed);
typed.of = typedof;