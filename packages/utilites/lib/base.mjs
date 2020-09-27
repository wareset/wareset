"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.has = exports.isSymb = exports.isFunc = exports.isBool = exports.isStr = exports.isNum = exports.isObj = exports.isArr = exports.getCtor = exports.getProto = exports.isVoid = void 0;

const isVoid = v => v == null;

exports.isVoid = isVoid;

const getProto = v => Object.getPrototypeOf || (v => v.__proto__);

exports.getProto = getProto;

const getCtor = v => isVoid(v) ? v : getProto(v).constructor;

exports.getCtor = getCtor;

const isArr = v => getCtor(v) === Array;

exports.isArr = isArr;

const isObj = v => getCtor(v) === Object;

exports.isObj = isObj;

const isNum = v => typeof v === 'number';

exports.isNum = isNum;

const isStr = v => typeof v === 'string';

exports.isStr = isStr;

const isBool = v => typeof v === 'boolean';

exports.isBool = isBool;

const isFunc = v => typeof v === 'function';

exports.isFunc = isFunc;

const isSymb = v => typeof v === 'symbol';

exports.isSymb = isSymb;
const has = Object.prototype.hasOwnProperty.call;
exports.has = has;