'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var isPromise = require('@wareset-utilites/is/isPromise');

var keys = require('@wareset-utilites/object/keys');

var o = {};
o[11] = 0, o[2] = 0;
var getSortedKeys = 2 == +keys.keys(o)[0] ? keys.keys : e => keys.keys(e).sort((e, t) => +e - +t);

var awaiter = (t, o) => {
  isPromise.isPromise(t) ? Promise.resolve(t).then(o) : o(t);
};

exports.awaiter = awaiter;
exports.getSortedKeys = getSortedKeys;
