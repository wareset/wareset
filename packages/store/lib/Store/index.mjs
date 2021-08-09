import { instanceOf } from '@wareset-utilites/lang/instanceOf';
import { findRight } from '@wareset-utilites/array/findRight';
import { isFunction } from '@wareset-utilites/is/isFunction';
import { Array } from '@wareset-utilites/array/Array';
import { isObject } from '@wareset-utilites/is/isObject';
import { isArray } from '@wareset-utilites/is/isArray';
import { unique } from '@wareset-utilites/unique';

var m = r => instanceOf(r, Store);

var u;

var n = t => t && isObject(t) && !isArray(t);

class Store extends Array {
  constructor(t, i, s, l) {
    super(), l = findRight([i, s, l], n), s = findRight([i, s], isFunction), !(i = i ? m(i) ? [i] : isArray(i) ? unique(i, m) : u : u) && m(t) && (i = [t]), this.__(this, t, i, s, l);
  }

  isStore(t) {
    return m(t);
  }

}

Store.isStore = m;
export { Store, m as isStore };
