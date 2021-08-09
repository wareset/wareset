import { defineProperty } from '@wareset-utilites/object/defineProperty';
import { forEachRight } from '@wareset-utilites/array/forEachRight';
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { spliceWith } from '@wareset-utilites/array/spliceWith';
import { isFunction } from '@wareset-utilites/is/isFunction';
import { isArray } from '@wareset-utilites/is/isArray';
import { clear } from '@wareset-utilites/array/clear';
import { isNill } from '@wareset-utilites/is/isNill';
import { unique } from '@wareset-utilites/unique';
import { is } from '@wareset-utilites/object/is';
import { isStore } from '../Store';
import { createOrder, removeOrder } from '../order';
import { awaiter } from '../utils';
import { removeWatcher, launchAutoWatch, addWatcher, createAutoWatch, updateAutoWatch } from '../watch';
import { launchListeners, addSubscriberInQueue, refreshSubscribersAndWatchers, launchQueue } from '../queue';
import { VK, VLK } from '../ekeys';
var k = null;
var q;

var E = {},
    L = t => t.__(E);

var storeSubscribe = (t, e, m) => {
  var l = isStore(t) || !isArray(t) ? [t] : [...t],
      h = unique(l, isStore).map(L).filter(t => !t[4]);
  var w,
      y,
      g = !0,
      b = !0;

  var S = () => {
    g && (b = g = !1, awaiter(w = e(...l.map(t => isStore(t) ? L(t)[7] : t)), t => {
      w = t, g = !y;
    }));
  };

  if (!h[0]) return S(), awaiter(w, t => {
    isFunction(t) && t();
  }), () => {};

  var d = () => {
    y || (y = !0, g = !1, removeOrder(k[0]), forEachLeft(h, t => {
      spliceWith(t[3], k, 1), launchListeners(t, 1, [e]);
    }), clear(h), awaiter(w, t => {
      isFunction(t) && t();
    }));
  },
      {
    [VK[2]]: j
  } = m || {},
      k = {
    2: j && !!h[1],
    0: createOrder(),
    1: h,
    4: d,
    5: S,
    3: e
  };

  return forEachLeft(h, t => {
    t[3].push(k), launchListeners(t, 1, [e]);
  }), b && addSubscriberInQueue(k), d;
};

var storeListener = (t, e, r, i) => {
  var n = L(t);
  var m,
      c,
      l = VLK[e];
  l || (l = e === VK[4] ? 2 : e === VK[5] ? 3 : l);
  var a = [k],
      f = {
    1: () => n[9].length + n[3].length,
    2: () => n[4],
    3: () => n[5],
    4: () => n[7]
  }[l];
  3 !== l && 4 !== l || (a[0] = n[7]);

  var p = t => c || (i = !1, t = t || [], awaiter(m = r(f(), t[0]), t => {
    m = t;
  }), !t[1] || t[1]());

  if (n[4]) return p(a), awaiter(m, t => {
    isFunction(t) && t();
  }), () => {};

  var h = () => {
    c || (c = !0, spliceWith(n[8][l], w, 1), spliceWith(n[8][0], w, 1), awaiter(m, t => {
      isFunction(t) && t();
    }));
  },
      w = {
    2: h,
    3: p
  };

  return n[8][l].push(w), n[8][0].push(w), i && p(a), h;
};

var storeDestroy = t => {
  forEachLeft(isStore(t) || !isArray(t) ? [t] : t, t => {
    if (isStore(t)) {
      var r = L(t);
      r[4] = !0, launchListeners(r, 2, [k]), forEachRight(r[3], t => {
        spliceWith(t[1], r, 1), t[1][0] ? launchListeners(r, 1, [t[3]]) : t[4]();
      }), clear(r[3]), clear(r[9]), forEachRight(r[1], t => {
        removeWatcher(r, t);
      }), clear(r[1]), forEachRight(r[8][0], t => {
        t[2]();
      }), removeOrder(r[0]);
    }
  });
};

var A = t => isStore(t) ? t.get() : t;

var innerStoreService = (e, o, s, i, n) => {
  var {
    [VK[2]]: c
  } = n || {},
      a = {
    3: [],
    8: {
      0: [],
      1: [],
      2: [],
      3: [],
      4: []
    },
    9: [],
    1: [],
    4: !1,
    5: !1,
    0: createOrder(),
    6: q,
    7: q,
    10: e,
    13: () => (launchAutoWatch(a), a[7]),
    12: t => (j(() => t), e),
    11: t => (t ? j(t) : refreshSubscribersAndWatchers(a, !0), e),
    2: !!c,
    14: !!i,
    15: k
  };
  s && (a[1] = s.map((t, e) => (addWatcher(a, e = L(t)), e)));
  var p = i ? s ? (t, r) => {
    awaiter(i(t, e), r);
  } : (t, r) => {
    createAutoWatch(a);
    var o = A(i(t, e));
    updateAutoWatch(a), awaiter(o, t => {
      r(t);
    });
  } : (t, e) => {
    e(t);
  };
  var b,
      x = !1;

  var j = t => {
    if (!a[4]) if (x) b = t;else {
      b = k, x = !0, a[5] = !0;
      var r = a[7];
      launchListeners(a, 3, [r]), b && (t = b, b = k), awaiter(t(r, e), t => {
        b ? (x = !1, j(b)) : p(a[6] = A(t), t => {
          if (b) x = !1, j(b);else {
            t = A(t);

            var _e = !1;

            if ((!1 !== a[15] && !is(r, t) || a[15]) && (_e = !0, a[7] = t, launchListeners(a, 4, [r, () => !b])), b) x = !1, j(b);else if (a[5] = !1, launchListeners(a, 3, [t, () => !b]), x = !1, b) j(b);else {
              var _t = a[15];
              a[15] = k, _e ? refreshSubscribersAndWatchers(a, _t) : launchQueue();
            }
          }
        });
      });
    }
  };

  defineProperty(e, '__', {
    value: t => t === E ? a : k
  }), forEachLeft([0, '$', 'value'], r => {
    defineProperty(e, r, {
      enumerable: !r,
      get: () => e.get(),
      set: t => {
        e.set(t);
      }
    });
  }), defineProperty(e, 'needUpdate', {
    get: () => a[15],
    set: t => {
      a[15] = isNill(t) ? k : !!t;
    }
  }), a[12](o);
};

var blankStoreService = (t, e) => ({
  _: function (r) {
    var o = L(this)[t];
    return e ? o(r) : o;
  }
})._;

export { blankStoreService, innerStoreService, storeDestroy, storeListener, storeSubscribe };
