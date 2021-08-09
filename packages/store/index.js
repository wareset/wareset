'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var lib = require('./lib');

var n = (t, o, r, s) => new lib.Store(t, o, r, s),
    c = lib.storeSubscribe,
    p = lib.storeListener;

var storeOnSubscribe = (e, t, o) => p(e, 'subscribe', t, o);

var storeOnDestroy = (e, t, o) => p(e, 'destroy', t, o);

var storeOnUpdate = (e, t, o) => p(e, 'update', t, o);

var storeOnChange = (e, t, o) => p(e, 'change', t, o);

Object.defineProperty(exports, 'Store', {
  enumerable: true,
  get: function () {
    return lib.Store;
  }
});
Object.defineProperty(exports, 'isStore', {
  enumerable: true,
  get: function () {
    return lib.isStore;
  }
});
Object.defineProperty(exports, 'storeDestroy', {
  enumerable: true,
  get: function () {
    return lib.storeDestroy;
  }
});
exports.default = n;
exports.store = n;
exports.storeListener = p;
exports.storeOnChange = storeOnChange;
exports.storeOnDestroy = storeOnDestroy;
exports.storeOnSubscribe = storeOnSubscribe;
exports.storeOnUpdate = storeOnUpdate;
exports.storeSubscribe = c;
