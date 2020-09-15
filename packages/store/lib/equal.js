const deepEqual = require('@wareset/deep-equal');
const { isVoid } = require('./index');

const equal = (a, b, deep = -1) => {
  if (isVoid(deep)) return false;
  if (deep === true || deep >= 0) return deepEqual(a, b, deep);
  return !(
    typeof a === 'function' ||
    (a && typeof a === 'object') ||
    !deepEqual(a, b, 0)
  );
};

module.exports = equal;
