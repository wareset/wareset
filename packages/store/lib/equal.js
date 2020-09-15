const deepEqual = require('@wareset/deep-equal');
const { isVoid, isFunc } = require('./index');

const equal = (a, b, deep = -1) => {
  if (isVoid(deep)) return false;
  if (deep === true || deep >= 0) return deepEqual(a, b, deep);
  return !(isFunc(a) || (a && typeof a === 'object') || !deepEqual(a, b, 0));
};

module.exports = equal;
