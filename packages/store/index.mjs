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
import { isFunction } from '@wareset-utilites/is/isFunction';
import { isThenable } from '@wareset-utilites/is/isThenable';
import { isObject } from '@wareset-utilites/is/isObject';
import { is } from '@wareset-utilites/object/is';
import { isArray } from '@wareset-utilites/is/isArray';
import { instanceofFactory } from '@wareset-utilites/is/lib/instanceofFactory';
import { defineProperty } from '@wareset-utilites/object/defineProperty';

var awaiter = (t, o, s) => {
  isThenable(t) ? t.then(t => {
    o(t, s);
  }) : o(t, s);
};

var noop = () => {};

var watchStoreRemove = (t, e) => {
  for (var _o = t.length; _o-- > 0;) {
    if (t[_o][1] === e) {
      t.splice(_o, 1);
      break;
    }
  }
};

var isNotEqualValue = (e, i) => !e._.strict && (isObject(i) || isFunction(i)) || !is(e._.k, i);

var watchStoreSetVals = (t, e) => {
  for (var _o2 = t.length; _o2-- > 0;) {
    t[_o2][1] = t[_o2][0]._.k;

    for (var _s = t[_o2].length; _s-- > 2;) {
      e[t[_o2][_s]] = t[_o2][1];
    }
  }
};

var n = !1,
    e$1 = 0,
    t = {
  v: 0,
  n: null
};
var p$1 = {
  v: 1 / 0
};
var v = p$1;

var l = () => {
  var t;

  for (; t = v.n;) {
    t.v = v.v + 1, v = t;
  }

  v = p$1, e$1 = 0, n = !1;
};

var createOrder = () => t = t.n = {
  v: t.v + 1,
  p: t,
  n: null
};

var removeOrder = p => {
  p.p.n = p.n, t === p ? t = p.p : p.n && (p.n.p = p.p, v.v > p.p.v && (v = p.p), e$1 < 4e4 ? e$1++ : n || (n = !0, setTimeout(l, 99))), p.v = -1, p.p = p.n = null;
};

var c$1 = e => !!e[0]._.j,
    o = c => isNotEqualValue(c[0], c[1]);

var launchQueue = e => {
  if (!e.b) {
    e.b = !0;
    var a = {};

    for (var _r, _t, _s2 = e.a; e.c;) {
      e.c = !1;

      for (var _b in _s2) {
        if (_r = _s2[_b], delete _s2[_b], _t = _r._.a.v, _r.c && _t > 0) if (_r._.lazy && _r._.h && _r._.h.some(c$1)) a[_t] = _r;else {
          if (+_b !== _t) {
            _s2[_t] = _r, e.c = !0;
            break;
          }

          if (_r.c = !1, (_r.d && !(_r.d = !1) || !_r._.h || _r._.h.some(o)) && (_r.b(), e.c)) break;
        }
      }
    }

    e.a = a, e.b = !1;
  }
};

var addSubscriberInQueue = (e, c, o) => {
  c.c = !0, o && (c.d = !0), e.a[c._.a.v] = c, e.c = !0;
};

var r$1 = [];

var addWatcherLink = (c, i) => {
  var n = c._,
      s = i._;
  (n.g || (n.g = [])).push({
    _: s,
    b: () => {
      watchStoreSetVals(s.h, r$1), i.set(s.inherit ? n.k : s.l);
    },
    a: noop,
    c: !1,
    d: !1
  }), runListenUpdate(n, 0);
};

var removeWatcherLink = (t, o) => {
  var r = t._.g;
  if (r) for (var _c = r.length; _c-- > 0;) {
    if (r[_c]._ === o._) {
      r.splice(_c, 1), runListenUpdate(t._, 0);
      break;
    }
  }
};

var storeSubscribe = (m, f, p) => {
  m = isArray(m) ? [...m] : [m];
  var h = [];

  for (var _t2, _r2 = {}, i = 0; i < m.length; ++i) {
    b(m[i]) && ((_t2 = m[i]._).i || (_t2.a.v in _r2 ? _r2[_t2.a.v].push(i) : h.push(_r2[_t2.a.v] = [m[i], {}, i])), m[i] = _t2.k);
  }

  var b$1,
      u = !0,
      c = !1,
      g = !h.length;

  var _ = () => {
    if (g = !0, u && c) {
      u = !1, removeOrder(w._.a), w.b = w.a = noop;

      for (var _t3, _r3, _e = h.length; _e-- > 0;) {
        (_t3 = (_r3 = h[_e][0]._).b.indexOf(w)) > -1 && (_r3.b.splice(_t3, 1), runListenUpdate(_r3, 0));
      }

      h.length = 0, awaiter(b$1, r => {
        isFunction(r) && r();
      });
    }
  },
      v = t => {
    b$1 = t, u = !0, g && _();
  },
      y = () => {
    u && (c = !(u = !1), watchStoreSetVals(h, m), awaiter(b$1 = f(m, _), v));
  },
      {
    lazy: d
  } = p || {},
      w = {
    _: {
      lazy: !!d,
      a: createOrder(),
      h: h
    },
    b: y,
    a: _,
    c: !1,
    d: !1
  };

  for (var _t4, _r4 = h.length; _r4-- > 0;) {
    ((_t4 = h[_r4][0]._).b || (_t4.b = [])).push(w), runListenUpdate(_t4, 0);
  }

  return c || y(), _;
};

var runListenUpdate = (n, t) => {
  if (n.c) {
    var _o3 = n.c[0];

    for (; _o3 = _o3.n;) {
      _o3.v.e === t && _o3.v.b();
    }
  }
};

var e = (e, r, s, c, p) => {
  var i = e._;
  var l,
      a,
      b = i.c;

  if (!b && !i.i) {
    var _n = {
      p: null,
      n: null
    };
    b = i.c = [_n, _n];
  }

  var u = {
    e: s,
    b: n => {
      a = c === (c = p(i, n)) ? a : r(c, u.a), awaiter(a, n => {
        a = n;
      });
    },
    a: () => {
      var e, r, s;
      l && (r = b, s = 1, (e = l).p && (e.p.n = e.n), r[s] === e ? r[s] = e.p : e.n && (e.n.p = e.p), e.v = e.p = null), u.b = u.a = noop, awaiter(a, t => {
        isFunction(t) && t();
      });
    }
  };
  var v, f, g;
  return i.i ? (u.b(c), u.a()) : (v = u, (f = b)[g = 1] = f[g].n = {
    v: v,
    p: f[g],
    n: null
  }, l = b[1], u.b(c)), u.a;
},
    r = {},
    s = n => (n.b ? n.b.length : 0) + (n.g ? n.g.length : 0);

var storeOnSubscribe = (n, t) => e(n, t, 0, -1, s);

var c = (n, t) => !(!n.i && t === r) || r;

var storeOnDestroy = (n, t) => e(n, t, 1, r, c);

var p = (n, t) => t === r ? r : [t, n.k];

var storeOnChange = (n, t) => e(n, t, 2, r, p);

var REFER_LIST = {
  l: [],
  b: !0
};

var proxyWatch = (t, e) => {
  REFER_LIST.b = !1;

  var r = e._.o(t, e);

  REFER_LIST.b = !0, awaiter(r, proxyDefault, e);
};

var proxyAutoWatch = (e, r) => {
  var l = {};
  REFER_LIST.l.push([r, l]);

  var f = r._.o(e, r);

  b(f) && (f = f.get()), REFER_LIST.l.pop();
  var i = r._.h;

  for (var _t5, _o4 = i.length; _o4-- > 0;) {
    _t5 = i[_o4][0]._.a.v, _t5 in l ? delete l[_t5] : (i.splice(_o4, 1), removeWatcherLink(i[_o4][0], r));
  }

  for (var _t6 in l) {
    l[_t6] === r || l[_t6]._.i || (i.push([l[_t6], l[_t6]._.k]), addWatcherLink(l[_t6], r));
  }

  awaiter(f, proxyDefault, r);
};

var proxyDefault = (n, p) => {
  var f = p._;

  if (!f.i) {
    if (f.m) {
      var _t7 = f.m;
      return f.m = null, void awaiter(_t7(f.k, p), update, p);
    }

    if (b(n) && (n = n._.k), f.r || isNotEqualValue(p, n)) {
      var _t8 = f.k;

      if (p.value = f.k = n, f.c) {
        var _e2 = f.c[0];

        for (; _e2 = _e2.n;) {
          if (2 === _e2.v.e && (_e2.v.b(_t8), f.m)) {
            var _e3 = f.m;
            return f.m = null, p.value = f.k = _t8, void awaiter(_e3(f.k, p), update, p);
          }
        }
      }

      if (f.b) for (var _o5 = 0; _o5 < f.b.length; ++_o5) {
        addSubscriberInQueue(f.q, f.b[_o5], f.r);
      }
      if (f.g) for (var _o6 = 0; _o6 < f.g.length; ++_o6) {
        addSubscriberInQueue(f.q, f.g[_o6], f.r);
      }
    }
  }

  f.j = f.r = !1, launchQueue(f.q);
};

var update = (e, l) => {
  var n = l._;
  if (n.i) n.j = !1, launchQueue(n.q);else if (n.m) {
    var _t9 = n.m;
    n.m = null, awaiter(_t9(n.k, l), update, l);
  } else n.n(n.l = b(e) ? e._.k : e, l);
};

class Store {
  get updating() {
    return this._.j;
  }

  get destroyed() {
    return !!this._.i;
  }

  set force(t) {
    this._.r = !!t;
  }

  constructor(t, e, r, o, l) {
    var h = isThenable(e),
        u = !h && b(e),
        c = h ? void 0 : u ? e._.k : e,
        {
      lazy: p,
      strict: g,
      inherit: _
    } = l || {};
    if (this._ = {
      a: createOrder(),
      b: null,
      g: null,
      h: r || o ? [] : null,
      c: null,
      i: !1,
      j: !1,
      k: c,
      l: c,
      m: null,
      o: o,
      n: o ? r ? proxyWatch : proxyAutoWatch : proxyDefault,
      q: t,
      lazy: !!p,
      strict: void 0 === g || !!g,
      inherit: void 0 === _ ? !o : !!_
    }, this.value = e, r) for (var i = {}, _s3 = r.length; _s3-- > 0;) {
      !b(r[_s3]) || r[_s3]._.i || r[_s3]._.a.v in i || (this._.h.push([r[_s3], {}]), addWatcherLink(r[_s3], this), i[r[_s3]._.a.v] = 1);
    }
    (h || o) && this.set(e);
  }

  get() {
    return REFER_LIST.b && REFER_LIST.l.length > 0 && (REFER_LIST.l[REFER_LIST.l.length - 1][1][this._.a.v] = this), this._.k;
  }

  set(t) {
    var e = this._;
    e.i || (e.j ? e.m = () => t : (e.m = null, e.j = !0, awaiter(t, update, this)));
  }

  update(t) {
    var e = this._;
    e.i || (e.j ? e.m = t : (e.m = null, e.j = !0, awaiter(t(e.k, this), update, this)));
  }

  subscribe(t) {
    return storeSubscribe([this], (e, i) => t(e[0], i));
  }

  destroy() {
    storeDestroy(this);
  }

}

var storeDestroy = t => {
  var e = t._;

  if (!e.i) {
    if (runListenUpdate(e, 1), e.i = !0, e.b) for (var i, _r5 = e.b.length; _r5-- > 0;) {
      i = e.b[_r5], watchStoreRemove(i._.h, t), i._.h.length || i.a();
    }
    if (e.h) for (var _i = e.h.length; _i-- > 0;) {
      removeWatcherLink(e.h[_i][0], t);
    }

    if (e.b = e.h = e.g = null, e.c) {
      var _t10 = e.c[0];

      for (; _t10 = _t10.n;) {
        0 === _t10.v.e && _t10.v.b(), _t10.v.a();
      }
    }

    removeOrder(e.a), e.o = e.n = e.q = null;
  }
};

var _ = Store.prototype;
defineProperty(_, "$", {
  get: _.get,
  set: _.set
});

var _loop = function (d, _v) {
  defineProperty(_, d[_v], {
    value: function (...t) {
      var e = this.get();
      return e = null != e && e[t[_v]] ? e[t[_v]](...t) : e, _v ? e : e + "";
    }
  });
};

for (var _v = 3, d = ["toString", "valueOf", "toJSON"]; _v-- > 0;) {
  _loop(d, _v);
}

var b = instanceofFactory(Store);

var contextFactory = () => ({
  a: {},
  b: !1,
  c: !1
});

var storeFactory = e => (e || (e = {
  a: {},
  b: !1,
  c: !1
}), (s, c, n, a) => (isArray(c) || (c = b(c) ? [c] : (a = n, n = c, null)), isFunction(n) || (a = n, n = null), new Store(e, s, c, n, a)));

export { Store, contextFactory, b as isStore, storeDestroy, storeFactory, storeOnChange, storeOnDestroy, storeOnSubscribe, storeSubscribe };
