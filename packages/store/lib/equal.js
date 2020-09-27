const deepEqual = require('@wareset/deep-equal');
const { isVoid, isFunc } = require('@wareset/utilites');

const equal = (a, b, deep) => {
  if (isVoid(deep)) return false;
  if (typeof deep === 'boolean' || deep >= 0) return deepEqual(a, b, deep);
  return !(isFunc(a) || !deepEqual(a, b, 0));
};

module.exports = equal;
