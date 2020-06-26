function __get_types(types = []) {
  if (Array.isArray(types[0])) types = [...types.shift(), ...types];
  return types;
}
function __is_void(value) {
  return value === undefined || value === null;
}
function __eq(proto, type) {
  if (proto === type) return true;
  if (__is_void(proto) || __is_void(type)) return false;
  return proto === type.prototype || proto.constructor === type.constructor;
}

const getProto = (value) => {
  if (__is_void(value)) return value;
  return (
    (typeof value === 'function' && value.prototype) ||
    Object.getPrototypeOf(value)
  );
};
const getProtos = (value) => {
  if (__is_void(value)) return [value];
  const protos = [];
  while ((value = getProto(value))) protos.push(value);
  return protos;
};

function typedOf(value, ...types) {
  if (!types.length) return getProtos(value);
  types = __get_types(types);
  return getProtos(value).some((proto) => {
    return types.some((type) => __eq(proto, type));
  });
}
typedOf.check = (value, ...args) => {
  if (!args.length || typedOf(value, ...args)) return value;
  throw new Error();
};

function typed(value, ...types) {
  if (!types.length) return getProto(value);
  const proto = getProto(value);
  return __get_types(types).some((type) => __eq(proto, type));
}
typed.check = (value, ...args) => {
  if (!args.length || typed(value, ...args)) return value;
  throw new Error();
};

typed.of = typedOf;

module.exports = typed;