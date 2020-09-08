const equal = require('@wareset/deep-equal');

const deepEqual = (a, b, d = 0) => typeof a !== 'function' && equal(a, b, d);
const fastEqual = (a, b) => equal(a, b, 0);
const baseEqual = (a, b) => !((a && typeof a === 'object') || !deepEqual(a, b));

module.exports = { deepEqual, fastEqual, baseEqual };
