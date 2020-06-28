function __get_types(types = []) {
  return Array.isArray(types[0]) ? [...types.shift(), ...types] : types;
}
function __is_void(value) {
  return value === undefined || value === null;
}
function __eq(proto, type) {
  if (proto === type) return true;
  if (__is_void(proto) || __is_void(type)) return false;
  return proto === type.prototype || proto.constructor === type.constructor;
}

function getProto(value) {
  if (__is_void(value)) return value;
  return (
    // Needed for primitives (constructors), AsyncFuncion and Generator.
    (typeof value === 'function' && value.prototype) ||
    // TODO: This method is 10 times faster and is available in all browsers. Leave him?
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
    value.__proto__ ||
    Object.getPrototypeOf(value)
  );
}
function getProtos(value) {
  if (__is_void(value)) return [value];
  const protos = [];
  while ((value = getProto(value))) protos.push(value);
  return protos;
}

function typedOf(value, ...types) {
  const protos = getProtos(value);
  if (!types.length) return protos;
  types = __get_types(types);
  return protos.some((proto) => {
    return types.some((type) => __eq(proto, type));
  });
}
typedOf.check = (value, ...args) => {
  if (!args.length || typedOf(value, ...args)) return value;
  throw new Error();
};

function typed(value, ...types) {
  const proto = getProto(value);
  if (!types.length) return proto;
  return __get_types(types).some((type) => __eq(proto, type));
}
typed.check = (value, ...args) => {
  if (!args.length || typed(value, ...args)) return value;
  throw new Error();
};

typed.of = typedOf;

export default typed;
