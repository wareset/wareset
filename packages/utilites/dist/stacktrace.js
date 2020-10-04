"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stacktrace = void 0;
let BASE_STACK = [];

const ERROR_STRING = () => String(Error().stack);

const stack = () => {
  const text = ERROR_STRING().split(/\n+/g).map(v => v.trim()).filter(v => BASE_STACK.indexOf(v) === -1);
  return text;
};

if (!BASE_STACK.length) BASE_STACK = stack();

const stacktrace = verbose => {
  let text = stack().reverse();
  text.pop();

  if (!verbose) {
    text = text.map(v => v.split(/:/g).slice(0, -2).join(':'));
  }

  if (verbose === 1) {
    text = text.map(v => v.split(/:/g).slice(-2).join(':').replace(/[^\d:]/g, ''));
  } else text = text.map((v, k, a) => k + '__' + v);

  if (!text.length) text.push('0__global');
  return text;
};

exports.stacktrace = stacktrace;