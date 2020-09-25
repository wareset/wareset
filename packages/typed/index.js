const __getTypes = (t = []) => {
  return Array.isArray(t[0]) && t[0].length ? [...t.shift(), ...t] : t;
};
const __isVoid = (value) => value == null;

function __eq(proto, type) {
  if (proto === type) return true;
  if (__isVoid(proto) || __isVoid(type)) return false;
  return proto === type.constructor;
}

const __proto = (v) => __isVoid(v) ? v : Object.getPrototypeOf(v);

function getProto(v) {
  v = __proto(v);
  return v ? v.constructor : v;
}
function getProtos(v) {
  const protos = [];
  while ((v = __proto(v))) protos.push(v ? v.constructor : v);
  return protos;
}

function typedof(value, ...types) {
  const protos = getProtos(value);
  if (!types.length) return protos;
  types = __getTypes(types);
  return protos.some((proto) => types.some((type) => __eq(proto, type)));
}
typedof.check = (value, ...args) => {
  if (!args.length || typedof(value, ...args)) return value;
  throw new Error();
};

function typed(value, ...types) {
  const proto = getProto(value);
  if (!types.length) return proto;
  return __getTypes(types).some((type) => __eq(proto, type));
}
typed.check = (value, ...args) => {
  if (!args.length || typed(value, ...args)) return value;
  throw new Error();
};

typed.of = typedof;

module.exports = typed;
