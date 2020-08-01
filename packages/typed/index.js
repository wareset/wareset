function __get_types(t = []) {
  return Array.isArray(t[0] && t.length) ? [...t.shift(), ...t] : t;
}
function __is_void(value) {
  return value === undefined || value === null;
}
function __eq(proto, type) {
  if (proto === type) return true;
  if (__is_void(proto) || __is_void(type)) return false;
  return proto === type.prototype || proto.constructor === type.constructor;
}

function get_proto(value) {
  if (__is_void(value)) return value;
  return Object.getPrototypeOf(value);
}
function get_protos(value) {
  if (__is_void(value)) return [value];
  const protos = [];
  while ((value = get_proto(value))) protos.push(value);

  return protos;
}

function typed_of(value, ...types) {
  const protos = get_protos(value);
  if (!types.length) return protos;
  types = __get_types(types);
  return protos.some(proto => types.some(type => __eq(proto, type)));
}
typed_of.check = (value, ...args) => {
  if (!args.length || typed_of(value, ...args)) return value;
  throw new Error();
};

function typed(value, ...types) {
  const proto = get_proto(value);
  if (!types.length) return proto;
  return __get_types(types).some(type => __eq(proto, type));
}
typed.check = (value, ...args) => {
  if (!args.length || typed(value, ...args)) return value;
  throw new Error();
};

typed.of = typed_of;

module.exports = typed;
