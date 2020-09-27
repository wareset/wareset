"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deepEqual = _interopRequireDefault(require("@wareset/deep-equal"));

var _utilites = require("@wareset/utilites");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (a, b, deep) => {
  if ((0, _utilites.isVoid)(deep)) return false;
  if (typeof deep === 'boolean' || deep >= 0) return (0, _deepEqual.default)(a, b, deep);
  return !((0, _utilites.isFunc)(a) || !(0, _deepEqual.default)(a, b, 0));
};

exports.default = _default;