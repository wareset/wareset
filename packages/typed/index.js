const getPrototypeOf = Object.getPrototypeOf || (v => v.__proto__);

const __proto = v => (v == null ? v : getPrototypeOf(v));

const getProto = v => ((v = __proto(v)) ? v.constructor : v);
const getProtos = v => {
  const protos = [];
  while ((v = __proto(v))) protos.push(v ? v.constructor : v);
  return protos;
};

const cases = t => {
  return Array.isArray(t[0]) && t[0].length ? [...t.shift(), ...t] : t;
};

const eq = (a, b) => a === b || a === getProto(b);

const check = fn => (value, ...a) => {
  if (a.length && !fn(value, ...a)) throw new TypeError(value, a);
  return value;
};

function typedof(value, ...t) {
  const arr = getProtos(value);
  return !t.length ? arr : cases(t).some(t => arr.some(proto => eq(proto, t)));
}
typedof.check = check(typedof);

export default function typed(value, ...t) {
  const proto = getProto(value);
  return !t.length ? proto : cases(t).some(t => eq(proto, t));
}
typed.check = check(typed);

typed.of = typedof;
