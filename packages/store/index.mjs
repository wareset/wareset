/* eslint-disable */
/*
dester builds:
__src__/utils.ts
__src__/order.ts
__src__/queue.ts
__src__/watch.ts
__src__/subscribe.ts
__src__/listen.ts
__src__/update.ts
__src__/Store.ts
__src__/factory.ts
index.ts
*/
import { isPromise } from '@wareset-utilites/is/isPromise';
import { timeout } from '@wareset-utilites/timeout';
import { isFunction } from '@wareset-utilites/is/isFunction';
import { isArray } from '@wareset-utilites/is/isArray';
import { isObject } from '@wareset-utilites/is/isObject';
import { is } from '@wareset-utilites/object/is';
import { instanceofFactory } from '@wareset-utilites/is/lib/instanceofFactory';
import { defineProperty } from '@wareset-utilites/object/defineProperty';

var t$1 = e => {
  e[2](e[0], e[1]);
};

var awaiter = (o, r, s) => {
  isPromise(o) ? Promise.all([o, s, r]).then(t$1) : r(o, s);
};

var remove = (e, t) => {
  for (var _o = e.length; _o-- > 0;) {
    if (e[_o] === t) {
      e.splice(_o, 1);
      break;
    }
  }
};

var storeIsUpdating = e => e._.i;

var t = !1,
    r$1 = 0,
    l = [1 / 0],
    o = [0, null, null];

var n = () => {
  var e;

  for (; e = l[2];) {
    e[0] = l[0] + 1, l = e;
  }

  l = [1 / 0], r$1 = 0, t = !1;
};

var createOrder = () => o = o[2] = [o[0] + 1, o, null];

var removeOrder = u => {
  u[1][2] = u[2], o === u ? o = u[1] : u[2] && (u[2][1] = u[1], l[0] > u[1][0] && (l = u[1]), r$1 < 4e4 ? r$1++ : t || (t = !0, timeout(99, n))), u[0] = -1, u[1] = u[2] = null;
};

var launchQueue = c => {
  if (!c.b) {
    var _o2, a;

    c.b = !0;
    var _r = c.a,
        _t = {};

    for (; c.c;) {
      c.c = !1;

      for (var b in _r) {
        if (_o2 = _r[b], delete _r[b], a = _o2._.a[0], _o2.c && a > 0) if (_o2._.lazy && _o2._.g.some(storeIsUpdating)) _t[a] = _o2;else {
          if (+b !== a) {
            _r[a] = _o2, c.c = !0;
            break;
          }

          if (_o2.c = !1, _o2.b(), c.c) break;
        }
      }
    }

    c.a = _t, c.b = !1;
  }
};

var addSubscriberInQueue = (e, c) => {
  c.c = !0, e.a[c._.a[0]] = c, e.c = !0;
};

var addWatcherLink = (_, e) => {
  _._.f.push({
    _: e._,
    b: () => {
      e.set(e._.inherit ? _._.j : e._.k);
    },
    c: !1
  });

  for (var _o3 of _._.c) {
    _o3.b();
  }
};

var removeWatcherLink = (_, e) => {
  for (var _o4 = _._.f.length; _o4-- > 0;) {
    if (_._.f[_o4]._ === e._) {
      _._.f.splice(_o4, 1);

      for (var _e of _._.c) {
        _e.b();
      }

      break;
    }
  }
};

var c$1 = o => _(o) ? o._.j : o,
    m$1 = o => o._.j;

var storeSubscribe = (_$1, a, l) => {
  var p = isArray(_$1) ? [..._$1] : [_$1],
      u = [],
      b = {};

  for (var _o5 of p) {
    !_(_o5) || _o5._.h || _o5._.a[0] in b || (u.push(_o5), b[_o5._.a[0]] = 1);
  }

  var h = p.length === u.length ? m$1 : c$1;
  var g,
      y,
      j = !0,
      w = !1,
      z = !u.length;

  var x = () => {
    if (z = !0, j && !y && w) {
      y = !(j = !1), removeOrder(d._.a);

      for (var _o6 of u) {
        remove(_o6._.b, d);

        for (var _t2 of _o6._.c) {
          _t2.b();
        }
      }

      u.length = 0, awaiter(g, t => {
        isFunction(t) && t();
      }), d._.a = d._.g = null, d._ = d.b = d.a = null;
    }
  },
      A = o => {
    g = o, j = !0, z && x();
  },
      F = () => {
    j && !y && (w = !(j = !1), awaiter(g = a(p.map(h), x), A));
  },
      {
    lazy: S
  } = l || {},
      d = {
    _: {
      lazy: !!S,
      a: createOrder(),
      g: u
    },
    b: F,
    a: x,
    c: !1
  };

  for (var _o7 of u) {
    _o7._.b.push(d);

    for (var _t3 of _o7._.c) {
      _t3.b();
    }
  }

  return w || S && u.some(storeIsUpdating) || F(), x;
};

var s = (s, e, r, c, i) => {
  var h = s._;
  var l, p;

  var u = () => {
    p || (p = !0, h.h || remove(h[r], a), awaiter(l, o => {
      isFunction(o) && o();
    }), a.b = a.a = null);
  },
      b = t => {
    p || (l = c === (c = i(h, t)) ? l : e(c, u));
  },
      a = {
    b: b,
    a: u
  };

  return h[r].push(a), b(c), h.h && u(), u;
},
    e = t => t.b.length + t.f.length;

var storeOnSubscribe = (t, o) => s(t, o, "c", -1, e);

var r = t => !!t.h;

var storeOnDestroy = (t, o) => s(t, o, "d", !1, r);

var c = {},
    i = (t, o) => o === c ? c : [o, t.j];

var storeOnChange = (t, o) => s(t, o, "e", c, i);

var REFER_LIST = [];

var proxyWatch = (o, t) => {
  awaiter(t._.n(o, t), proxyDefault, t);
};

var proxyAutoWatch = (o, t) => {
  var e = {};
  REFER_LIST.push([t, e]);

  var i = t._.n(o, t);

  _(i) && (i = i.get()), REFER_LIST.pop();
  var r = t._.g;
  var f;

  for (var _s = r.length; _s-- > 0;) {
    f = r[_s]._.a[0], f in e ? delete e[f] : (removeWatcherLink(r[_s], t), r.splice(_s, 1));
  }

  for (var _s2 in e) {
    e[_s2] === t || e[_s2]._.h || (addWatcherLink(e[_s2], t), r.push(e[_s2]));
  }

  awaiter(i, proxyDefault, t);
};

var proxyDefault = (n, p) => {
  var f = p._;
  if (f.h) f.i = !1, launchQueue(f.o);else if (f.l) {
    var _o8 = f.l;
    f.l = null, awaiter(_o8(f.j, p), update, p);
  } else if (_(n) && (n = n._.j), !is(f.j, n) || !f.strict && (isFunction(n) || isObject(n))) {
    var _o9 = f.j;
    p.value = f.j = n;

    for (var _t4 of f.e) {
      _t4.b(_o9);
    }

    if (f.l) {
      var _o10 = f.l;
      f.l = null, awaiter(_o10(f.j, p), update, p);
    } else {
      f.i = !1;

      for (var _o11 of f.b) {
        addSubscriberInQueue(f.o, _o11);
      }

      for (var _o12 of f.f) {
        addSubscriberInQueue(f.o, _o12);
      }

      launchQueue(f.o);
    }
  } else f.i = !1, launchQueue(f.o);
};

var update = (o, t) => {
  var e = t._;
  if (e.h) e.i = !1, launchQueue(e.o);else if (e.l) {
    var _o13 = e.l;
    e.l = null, awaiter(_o13(e.j, t), update, t);
  } else e.m(e.k = _(o) ? o._.j : o, t);
};

class Store {
  get updating() {
    return this._.i;
  }

  get destroyed() {
    return this._.h;
  }

  constructor(t, o, e, s, n) {
    var l = isPromise(o),
        f = !l && _(o),
        u = l ? void 0 : f ? o._.j : o,
        {
      lazy: m,
      strict: p,
      inherit: d
    } = n || {};

    if (this._ = {
      b: [],
      c: [],
      d: [],
      e: [],
      f: [],
      g: [],
      h: !1,
      i: !1,
      a: createOrder(),
      j: u,
      k: u,
      l: null,
      n: s,
      m: s ? e ? proxyWatch : proxyAutoWatch : proxyDefault,
      o: t,
      lazy: !!m,
      strict: void 0 === p || !!p,
      inherit: void 0 === d ? !s : !!d
    }, this.value = o, e) {
      var _t5 = {};

      for (var _o14 of e) {
        !_(_o14) || _o14._.h || _o14._.a[0] in _t5 || (addWatcherLink(_o14, this), this._.g.push(_o14), _t5[_o14._.a[0]] = 1);
      }
    }

    (l || s) && this.set(o);
  }

  get() {
    return REFER_LIST.length > 0 && (REFER_LIST[REFER_LIST.length - 1][1][this._.a[0]] = this), this._.j;
  }

  set(t) {
    var o = this._;
    o.h || (o.i ? o.l = () => t : (o.l = null, o.i = !0, awaiter(t, update, this)));
  }

  update(t) {
    var o = this._;
    o.h || (o.i ? o.l = t : (o.l = null, o.i = !0, awaiter(t(o.j, this), update, this)));
  }

  destroy() {
    var t = this._;

    if (!t.h) {
      t.h = !0;

      for (var _o15 of t.d) {
        _o15.b();
      }

      for (var _o16 of t.b) {
        remove(_o16._.g, this), _o16._.g.length || _o16.a();
      }

      for (var _o17 of t.g) {
        removeWatcherLink(_o17, this);
      }

      t.f.length = t.g.length = t.b.length = 0;

      for (var _o18 of t.c) {
        _o18.b(), _o18.a();
      }

      for (var _o19 of t.d) {
        _o19.a();
      }

      t.e.length = t.d.length = t.c.length = 0, t.n = t.m = t.o = null, removeOrder(t.a);
    }
  }

}

var m = Store.prototype;
defineProperty(m, "$", {
  get: m.get,
  set: m.set
});

var _loop = function (p, d) {
  defineProperty(m, d[p], {
    value: function (...t) {
      var o = this.get();
      return o = null != o && o[t[p]] ? o[t[p]](...t) : o, p ? o : o + "";
    }
  });
};

for (var p = 3, d = ["toString", "valueOf", "toJSON"]; p-- > 0;) {
  _loop(p, d);
}

var _ = instanceofFactory(Store);

var contextFactory = () => ({
  a: {},
  b: !1,
  c: !1
});

var storeFactory = e => (e || (e = {
  a: {},
  b: !1,
  c: !1
}), (s, c, n, a) => (isArray(c) || (c = _(c) ? [c] : (a = n, n = c, null)), isFunction(n) || (a = n, n = null), new Store(e, s, c, n, a)));

export { Store, contextFactory, _ as isStore, storeFactory, storeOnChange, storeOnDestroy, storeOnSubscribe, storeSubscribe };
