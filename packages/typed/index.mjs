const getProto = Object.getPrototypeOf || (v => v.__proto__);
const getPrototypeOf = v => (v == null ? v : getProto(v));

const getCtor = v => ((v = getPrototypeOf(v)) ? v.constructor : v);
const getCtors = v => {
  const protos = [];
  while ((v = getPrototypeOf(v))) protos.push(v ? v.constructor : v);
  return protos;
};

const isArr = v => getCtor(v) === Array;
const eq = (a, b) => a === b || a === getCtor(b);
const cases = t => (isArr(t[0]) && t[0].length ? [...t.shift(), ...t] : t);
const check = fn => (value, ...a) => {
  if (a.length && !fn(value, ...a)) throw new TypeError(value, a);
  return value;
};

function typedof(value, ...t) {
  const arr = getCtors(value);
  return !t.length ? arr : cases(t).some(t => arr.some(proto => eq(proto, t)));
}
typedof.check = check(typedof);

export default function typed(value, ...t) {
  const proto = getCtor(value);
  return !t.length ? proto : cases(t).some(t => eq(proto, t));
}
typed.check = check(typed);
typed.of = typedof;
