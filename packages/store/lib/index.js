'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var defineProperty = require('@wareset-utilites/object/defineProperty');

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var isNill = require('@wareset-utilites/is/isNill');

var Store = require('./Store');

var service = require('./service');

var ekeys = require('./ekeys');

var p = Store.Store.prototype;
defineProperty.defineProperty(p, '__', {
  value: service.innerStoreService
}), forEachLeft.forEachLeft([11, 12, 13], t => {
  defineProperty.defineProperty(p, ekeys.VK[t], {
    value: service.blankStoreService(t, !0)
  });
}), forEachLeft.forEachLeft([4, 5, 2], t => {
  defineProperty.defineProperty(p, ekeys.VK[t], {
    get: service.blankStoreService(t)
  });
}), forEachLeft.forEachLeft(['toString', 'valueOf', 'toJSON'], (t, o) => {
  defineProperty.defineProperty(p, t, {
    value: function (...e) {
      var i = this.get();
      return i = isNill.isNill(i) || !i[t] ? i : i[t](...e), o ? i : i + '';
    }
  });
});
Object.defineProperty(exports, 'Store', {
  enumerable: true,
  get: function () {
    return Store.Store;
  }
});
Object.defineProperty(exports, 'isStore', {
  enumerable: true,
  get: function () {
    return Store.isStore;
  }
});
Object.defineProperty(exports, 'storeDestroy', {
  enumerable: true,
  get: function () {
    return service.storeDestroy;
  }
});
Object.defineProperty(exports, 'storeListener', {
  enumerable: true,
  get: function () {
    return service.storeListener;
  }
});
Object.defineProperty(exports, 'storeSubscribe', {
  enumerable: true,
  get: function () {
    return service.storeSubscribe;
  }
});
