'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var defineProperty = require('@wareset-utilites/object/defineProperty');

var forEachRight = require('@wareset-utilites/array/forEachRight');

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var spliceWith = require('@wareset-utilites/array/spliceWith');

var isFunction = require('@wareset-utilites/is/isFunction');

var isArray = require('@wareset-utilites/is/isArray');

var clear = require('@wareset-utilites/array/clear');

var isNill = require('@wareset-utilites/is/isNill');

var unique = require('@wareset-utilites/unique');

var is = require('@wareset-utilites/object/is');

var Store = require('../Store');

var order = require('../order');

var utils = require('../utils');

var watch = require('../watch');

var queue = require('../queue');

var ekeys = require('../ekeys');

var k = null;
var q;

var E = {},
    L = t => t.__(E);

var storeSubscribe = (t, e, m) => {
  var l = Store.isStore(t) || !isArray.isArray(t) ? [t] : [...t],
      h = unique.unique(l, Store.isStore).map(L).filter(t => !t[4]);
  var w,
      y,
      g = !0,
      b = !0;

  var S = () => {
    g && (b = g = !1, utils.awaiter(w = e(...l.map(t => Store.isStore(t) ? L(t)[7] : t)), t => {
      w = t, g = !y;
    }));
  };

  if (!h[0]) return S(), utils.awaiter(w, t => {
    isFunction.isFunction(t) && t();
  }), () => {};

  var d = () => {
    y || (y = !0, g = !1, order.removeOrder(k[0]), forEachLeft.forEachLeft(h, t => {
      spliceWith.spliceWith(t[3], k, 1), queue.launchListeners(t, 1, [e]);
    }), clear.clear(h), utils.awaiter(w, t => {
      isFunction.isFunction(t) && t();
    }));
  },
      {
    [ekeys.VK[2]]: j
  } = m || {},
      k = {
    2: j && !!h[1],
    0: order.createOrder(),
    1: h,
    4: d,
    5: S,
    3: e
  };

  return forEachLeft.forEachLeft(h, t => {
    t[3].push(k), queue.launchListeners(t, 1, [e]);
  }), b && queue.addSubscriberInQueue(k), d;
};

var storeListener = (t, e, r, i) => {
  var n = L(t);
  var m,
      c,
      l = ekeys.VLK[e];
  l || (l = e === ekeys.VK[4] ? 2 : e === ekeys.VK[5] ? 3 : l);
  var a = [k],
      f = {
    1: () => n[9].length + n[3].length,
    2: () => n[4],
    3: () => n[5],
    4: () => n[7]
  }[l];
  3 !== l && 4 !== l || (a[0] = n[7]);

  var p = t => c || (i = !1, t = t || [], utils.awaiter(m = r(f(), t[0]), t => {
    m = t;
  }), !t[1] || t[1]());

  if (n[4]) return p(a), utils.awaiter(m, t => {
    isFunction.isFunction(t) && t();
  }), () => {};

  var h = () => {
    c || (c = !0, spliceWith.spliceWith(n[8][l], w, 1), spliceWith.spliceWith(n[8][0], w, 1), utils.awaiter(m, t => {
      isFunction.isFunction(t) && t();
    }));
  },
      w = {
    2: h,
    3: p
  };

  return n[8][l].push(w), n[8][0].push(w), i && p(a), h;
};

var storeDestroy = t => {
  forEachLeft.forEachLeft(Store.isStore(t) || !isArray.isArray(t) ? [t] : t, t => {
    if (Store.isStore(t)) {
      var r = L(t);
      r[4] = !0, queue.launchListeners(r, 2, [k]), forEachRight.forEachRight(r[3], t => {
        spliceWith.spliceWith(t[1], r, 1), t[1][0] ? queue.launchListeners(r, 1, [t[3]]) : t[4]();
      }), clear.clear(r[3]), clear.clear(r[9]), forEachRight.forEachRight(r[1], t => {
        watch.removeWatcher(r, t);
      }), clear.clear(r[1]), forEachRight.forEachRight(r[8][0], t => {
        t[2]();
      }), order.removeOrder(r[0]);
    }
  });
};

var A = t => Store.isStore(t) ? t.get() : t;

var innerStoreService = (e, o, s, i, n) => {
  var {
    [ekeys.VK[2]]: c
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
    0: order.createOrder(),
    6: q,
    7: q,
    10: e,
    13: () => (watch.launchAutoWatch(a), a[7]),
    12: t => (j(() => t), e),
    11: t => (t ? j(t) : queue.refreshSubscribersAndWatchers(a, !0), e),
    2: !!c,
    14: !!i,
    15: k
  };
  s && (a[1] = s.map((t, e) => (watch.addWatcher(a, e = L(t)), e)));
  var p = i ? s ? (t, r) => {
    utils.awaiter(i(t, e), r);
  } : (t, r) => {
    watch.createAutoWatch(a);
    var o = A(i(t, e));
    watch.updateAutoWatch(a), utils.awaiter(o, t => {
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
      queue.launchListeners(a, 3, [r]), b && (t = b, b = k), utils.awaiter(t(r, e), t => {
        b ? (x = !1, j(b)) : p(a[6] = A(t), t => {
          if (b) x = !1, j(b);else {
            t = A(t);

            var _e = !1;

            if ((!1 !== a[15] && !is.is(r, t) || a[15]) && (_e = !0, a[7] = t, queue.launchListeners(a, 4, [r, () => !b])), b) x = !1, j(b);else if (a[5] = !1, queue.launchListeners(a, 3, [t, () => !b]), x = !1, b) j(b);else {
              var _t = a[15];
              a[15] = k, _e ? queue.refreshSubscribersAndWatchers(a, _t) : queue.launchQueue();
            }
          }
        });
      });
    }
  };

  defineProperty.defineProperty(e, '__', {
    value: t => t === E ? a : k
  }), forEachLeft.forEachLeft([0, '$', 'value'], r => {
    defineProperty.defineProperty(e, r, {
      enumerable: !r,
      get: () => e.get(),
      set: t => {
        e.set(t);
      }
    });
  }), defineProperty.defineProperty(e, 'needUpdate', {
    get: () => a[15],
    set: t => {
      a[15] = isNill.isNill(t) ? k : !!t;
    }
  }), a[12](o);
};

var blankStoreService = (t, e) => ({
  _: function (r) {
    var o = L(this)[t];
    return e ? o(r) : o;
  }
})._;

exports.blankStoreService = blankStoreService;
exports.innerStoreService = innerStoreService;
exports.storeDestroy = storeDestroy;
exports.storeListener = storeListener;
exports.storeSubscribe = storeSubscribe;
