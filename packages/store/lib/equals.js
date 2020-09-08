const equal = require('@wareset/deep-equal');

const fastEqual = (a, b) => equal(a, b, 0);
const deepEqual = (a, b, d = 2) => equal(a, b, d);
const baseEqual = (a, b) => {
  return !(
    typeof a === 'function' ||
    (a && typeof a === 'object') ||
    !equal(a, b, 0)
  );
};

module.exports = { fastEqual, deepEqual, baseEqual };
