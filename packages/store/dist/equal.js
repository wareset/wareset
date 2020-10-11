"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _deepEqual() {
  const data = _interopRequireDefault(require("@wareset/deep-equal"));

  _deepEqual = function () {
    return data;
  };

  return data;
}

function _utilites() {
  const data = require("@wareset/utilites");

  _utilites = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (a, b, deep) => {
  if ((0, _utilites().isVoid)(deep)) return false;
  if (typeof deep === 'boolean' || deep >= 0) return (0, _deepEqual().default)(a, b, deep); // return !(isFunc(a) || !deepEqual(a, b, 0));

  return (0, _deepEqual().default)(a, b, 0);
};

exports.default = _default;