"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nearly;
const {
  abs,
  floor,
  round,
  ceil
} = Math;
const METHODS_FOR_NUM = {
  '-1': floor,
  '0': round,
  '1': ceil
};
const METHODS_FOR_ARR = {
  '-1': (a, b, c = 0) => abs(a - c) <= abs(b - c),
  '0': (a, b, c = 0) => abs(a - c) < abs(b - c)
};

function nearly(value = 1, pattern = 0, method = 0) {
  if (Array.isArray(pattern)) {
    if (!pattern.length) return value;
    const f = METHODS_FOR_ARR[method] || METHODS_FOR_ARR[0];
    return pattern.reduce((prev, curr) => f(prev, curr, value) ? prev : curr);
  }

  if (pattern && typeof pattern === 'number') {
    if (pattern < 0) pattern = -pattern;
    const coef = abs(value % pattern);
    let res = value - coef;
    res = method > 0 || !method && coef > pattern / 2 ? res + pattern : res;
    const str = `${pattern}`;
    const index = str.indexOf('.');
    return index === -1 ? res : +res.toFixed(str.length - index - 1);
  }

  return (METHODS_FOR_NUM[method] || METHODS_FOR_NUM[0])(value);
}