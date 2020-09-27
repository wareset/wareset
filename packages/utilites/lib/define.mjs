"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _base = require("./base");

var _default = object => (key, props, writable) => {
  if (!(0, _base.isObj)(props)) props = {
    value: props
  };
  props = {
    enumerable: false,
    configurable: true,
    writable: true,
    ...props
  };
  if (props.get || props.set) delete props.writable;else if (writable !== undefined) props.writable = !!writable;
  Object.defineProperty(object, key, props);
};

exports.default = _default;