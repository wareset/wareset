import { defineProperty } from '@wareset-utilites/object/defineProperty';
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { isNill } from '@wareset-utilites/is/isNill';
import { Store } from './Store';
export { Store, isStore } from './Store';
import { innerStoreService, blankStoreService } from './service';
export { storeDestroy, storeListener, storeSubscribe } from './service';
import { VK } from './ekeys';
var p = Store.prototype;
defineProperty(p, '__', {
  value: innerStoreService
}), forEachLeft([11, 12, 13], t => {
  defineProperty(p, VK[t], {
    value: blankStoreService(t, !0)
  });
}), forEachLeft([4, 5, 2], t => {
  defineProperty(p, VK[t], {
    get: blankStoreService(t)
  });
}), forEachLeft(['toString', 'valueOf', 'toJSON'], (t, o) => {
  defineProperty(p, t, {
    value: function (...e) {
      var i = this.get();
      return i = isNill(i) || !i[t] ? i : i[t](...e), o ? i : i + '';
    }
  });
});
