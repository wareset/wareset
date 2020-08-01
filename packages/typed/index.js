"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function __get_types() {
  var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return Array.isArray(t[0] && t.length) ? [].concat(_toConsumableArray(t.shift()), _toConsumableArray(t)) : t;
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
  return value.__proto__ || Object.getPrototypeOf(value);
}
function get_protos(value) {
  if (__is_void(value)) return [value];
  var protos = [];
  while (value = get_proto(value)) {
    protos.push(value);
  }return protos;
}

function typed_of(value) {
  for (var _len = arguments.length, types = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    types[_key - 1] = arguments[_key];
  }

  var protos = get_protos(value);
  if (!types.length) return protos;
  types = __get_types(types);
  return protos.some(function (proto) {
    return types.some(function (type) {
      return __eq(proto, type);
    });
  });
}
typed_of.check = function (value) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if (!args.length || typed_of.apply(undefined, [value].concat(args))) return value;
  throw new Error();
};

function typed(value) {
  var proto = get_proto(value);

  for (var _len3 = arguments.length, types = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    types[_key3 - 1] = arguments[_key3];
  }

  if (!types.length) return proto;
  return __get_types(types).some(function (type) {
    return __eq(proto, type);
  });
}
typed.check = function (value) {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  if (!args.length || typed.apply(undefined, [value].concat(args))) return value;
  throw new Error();
};

typed.of = typed_of;

exports.default = typed;
module.exports = exports.default;
module.exports.default = exports.default;
