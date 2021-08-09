'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var instanceOf = require('@wareset-utilites/lang/instanceOf');

var findRight = require('@wareset-utilites/array/findRight');

var isFunction = require('@wareset-utilites/is/isFunction');

var _Array = require('@wareset-utilites/array/Array');

var isObject = require('@wareset-utilites/is/isObject');

var isArray = require('@wareset-utilites/is/isArray');

var unique = require('@wareset-utilites/unique');

var m = r => instanceOf.instanceOf(r, Store);

var u;

var n = t => t && isObject.isObject(t) && !isArray.isArray(t);

class Store extends _Array.Array {
  constructor(t, i, s, l) {
    super(), l = findRight.findRight([i, s, l], n), s = findRight.findRight([i, s], isFunction.isFunction), !(i = i ? m(i) ? [i] : isArray.isArray(i) ? unique.unique(i, m) : u : u) && m(t) && (i = [t]), this.__(this, t, i, s, l);
  }

  isStore(t) {
    return m(t);
  }

}

Store.isStore = m;
exports.Store = Store;
exports.isStore = m;
