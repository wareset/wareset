/* eslint-disable */
/*
dester builds:
__core__/utils.ts
__core__/keypad.ts
__core__/resize.ts
__core__/native.ts
__core__/cursor.ts
index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = "undefined" != typeof window, t = e && "onpointermove" in document, r = Array.isArray, n = () => {}, s = () => n, a = e => {
    e.preventDefault();
}, o = e => {
    e.stopPropagation();
}, i = (e, t, r, n) => {
    e.addEventListener(t, r, n);
}, l = (e, t, r) => {
    e.removeEventListener(t, r);
}, c = (e, t, r) => (e.set(t, r), r), p = /^([a-z]+)|([.\d]+)|\(([^)]+)\)|\[([^\]]+)\]|(?<=\W)(\w+)/g, h = e => {
    var t, r, n = {
        type: "",
        num: 500,
        self: !1,
        trusted: !1,
        once: !1,
        stop: !1,
        prevent: !1,
        passive: !1,
        capture: !1,
        x: !1,
        y: !1,
        u: !1,
        d: !1,
        l: !1,
        r: !1,
        xy: !1,
        keys: {},
        kLen: 0
    };
    for (p.lastIndex = 0; t = p.exec(e); ) (r = t[1]) ? n.type = r : (r = t[2]) && (n.num = 1e3 * +r), 
    (r = t[3]) || (r = t[4]) ? (n.kLen++, n.keys[r] = 1) : (r = t[5]) && (r in n || (r = r[0]) in n) && (n[r] = !0);
    return n.xy = n.x || n.y || n.u || n.d || n.l || n.r, n;
}, u = e => function(t) {
    for (var r = 0; r < e.length; r++) e[r].call(this, t);
}, f = (e, t) => function(r) {
    d(t) && e.call(this, r);
}, v = e => function(t) {
    t.target === this && e.call(this, t);
}, g = e => function(t) {
    t.isTrusted && e.call(this, t);
}, d = e => {
    var t = e.kLen;
    for (var r in y) {
        if (!(y[r][0] in e.keys) && !(y[r][1] in e.keys)) break;
        t--;
    }
    return t <= 0;
}, y = {}, k = [];

(() => {
    if (e) {
        i(document, "keyup", (e => {
            delete y[e.code + e.key];
        }), !1), i(document, "keydown", (e => {
            y[e.code + e.key] = [ e.code, e.key ];
            for (var t = 0; t < k.length; t++) k[t][0].kLen ? ("test" === k[t][0].type || d(k[t][0])) && k[t][1](e) : k.splice(t--, 1);
        }), !1);
    }
})();

var m = e ? (e, t) => {
    var n;
    if (r(e)) {
        for (var s = [], i = 0; i < e.length; i++) s.push(m(e[i], t));
        n = () => {
            for (;s.length; ) s.pop()();
        };
    } else {
        var l = [].concat(t), c = h(e);
        c.kLen || (c.kLen = 1, c.type = "test"), n = () => {
            c.kLen = l.length = 0;
        };
        var p = u(l);
        c.once && l.push(n), c.stop && l.unshift(o), c.prevent && l.unshift(a), c.trusted && (p = g(p)), 
        k.push([ c, p ]);
    }
    return n;
} : s, w = (() => {
    if (!e) return s;
    var t, r = new WeakMap, a = e => "offsetWidth" in e ? [ e.offsetWidth, e.offsetHeight ] : [ e.clientWidth, e.clientHeight ], o = e => {
        var n = r.get(e), [s, o] = a(e);
        if (n[2][0] !== s || n[2][1] !== o) {
            n[2][0] = s, n[2][1] = o;
            var i = n[1] = e.getBoundingClientRect();
            s = i.right - i.left, o = i.bottom - i.top;
            for (var l = 0; l < n[0].length; l++) for (var c = n[0][l], p = 0; p < c.length; p++) c[p]({
                target: e,
                width: s,
                height: o,
                top: i.top,
                left: i.left
            }), c.length || (n[0].splice(l--, 1), n[0].length || (t.unobserve(e), r.delete(e)));
        }
    }, i = () => {
        if (i = n, "undefined" != typeof ResizeObserver) t = new ResizeObserver((e => {
            for (var t = 0; t < e.length; t++) o(e[t].target);
        })); else {
            var e, r = [ 0 ], s = [], a = setTimeout, l = clearTimeout, c = () => {
                for (l(e), r[0] = 0; r[0] < s.length; r[0]++) o(s[r[0]]);
                s.length && (e = a(c, 20));
            };
            document.addEventListener("visibilitychange", (() => {
                document.hidden ? l(e) : c();
            }), !1), (t = {}).observe = e => {
                s.push(e), a(c, 20);
            }, t.unobserve = () => {
                s.splice(r[0]--, 1);
            };
        }
    };
    return (e, n, s = !0) => {
        i();
        var o, l = [].concat(n), p = r.get(e) || (t.observe(e), c(r, e, [ [], e.getBoundingClientRect(), a(e) ]));
        if (p[0].push(l), s) for (var h = (o = p[1]).right - o.left, u = o.bottom - o.top, f = 0; f < l.length; f++) l[f]({
            target: e,
            width: h,
            height: u,
            top: o.top,
            left: o.left
        });
        return () => {
            l.length = 0;
        };
    };
})(), x = e ? (e, t, n) => {
    var s;
    if (r(t)) {
        for (var c = [], p = 0; p < t.length; p++) c.push(x(e, t[p], n));
        s = () => {
            for (;c.length; ) c.pop()();
        };
    } else {
        var d = [].concat(n), y = h(t);
        if (!y.type) throw t;
        s = () => {
            d.length = 0, l(e, y.type, k);
        };
        var k = u(d);
        y.once && d.push(s), y.stop && d.unshift(o), y.prevent && d.unshift(a), y.kLen && (k = f(k, y)), 
        y.self && (k = v(k)), y.trusted && (k = g(k)), i(e, y.type, k, {
            passive: y.passive,
            capture: y.capture
        });
    }
    return s;
} : s, b = (() => {
    if (!e) return s;
    var o, p, d, y, k, m, w = e => e < 0 ? -e : e, x = e => {
        for (var t = 0, r = e.length; r-- > 0; ) t += e[r];
        return t;
    }, b = e => !e.xy || p === F && (e.x || e.l) || p === H && (e.x || e.r) || p === B && (e.y || e.u) || p === C && (e.y || e.d), L = e ? window.getSelection ? () => {
        window.getSelection().removeAllRanges();
    } : () => {
        document.selection.empty();
    } : n, W = new WeakMap, X = new WeakMap, Y = new WeakMap, z = "start", M = "move", R = "end", T = "click", E = "dblclick", I = "press", P = "repeat", A = "hoverin", N = "hoverout", O = "focusin", S = "focusout", B = "up", C = "down", F = "left", H = "right", _ = (e, t) => ({
        type: e,
        target: o,
        direction: p,
        isFirst: D,
        isFinal: q,
        page: {
            x: U,
            y: V
        },
        delta: {
            x: ee,
            y: te
        },
        offset: {
            x: Z,
            y: $
        },
        client: {
            x: G,
            y: J
        },
        screen: {
            x: K,
            y: Q
        },
        isTrusted: t.isTrusted,
        event: t
    }), j = (e, t, r) => {
        var n = W.get(e);
        if (n && t in n) {
            for (var s, a = n[t], o = 0; s = a[o], o < a.length; o++) {
                for (var i = 0; i < s.length; i++) s[i](_(t, r));
                s.length || a.splice(o--, 1);
            }
            a.length || delete n[t];
        }
    }, D = !1, q = !1, G = 0, J = 0, K = 0, Q = 0, U = 0, V = 0, Z = 0, $ = 0, ee = 0, te = 0, re = [ 0, 0, 0, 0, 0 ], ne = [ 0, 0, 0, 0, 0 ], se = !1, ae = !1, oe = !1, ie = [], le = {}, ce = {}, pe = [], he = [], ue = {}, fe = (e, t, r) => {
        if (r || 1 === e.touches.length) {
            var s = o = e.target, a = t !== M ? s : ce, i = le !== s, l = ce !== a, {clientX: c, clientY: h, pageX: u, pageY: f, screenX: v, screenY: g} = r ? e : e.touches[0] || {
                clientX: G,
                clientY: J,
                pageX: U,
                pageY: V,
                screenX: K,
                screenY: Q
            };
            d = e.timeStamp, se = !1, t === M ? oe && !ae && (ae = !0) : (ie.forEach(clearInterval), 
            ie.length = 0, t === z ? (ue = o, oe = !0, y = d, G = c, J = h, Z = $ = 0) : (oe = !1, 
            k = d, ae && (ae = !(se = !0)))), ee = -G + (G = c), te = -J + (J = h), $ += te, 
            K = v, Q = g, U = u, V = f;
            var m = 1e3 * (w(Z += ee) + w($));
            re.shift(), ne.shift(), re.push(ee), ne.push(te);
            var W = x(re), fe = x(ne);
            if (p = w(W) > w(fe) ? W < 0 ? F : H : fe < 0 ? B : C, i || l) {
                var ve = e.composedPath && e.composedPath() || (e => {
                    var t = [], r = e.target;
                    do {
                        t.push(r);
                    } while (r = r.parentNode);
                    return t.push(window), t;
                })(e), ge = ve.length - 2;
                if (i) {
                    le = s;
                    for (var de = ve, ye = ge, ke = pe.length - 2; de[ye] === pe[ke]; ) ye--, ke--;
                    for (;ke >= 0; ke--) j(pe[ke], N, e);
                    for (;ye >= 0; ye--) j(de[ye], A, e);
                    pe = de;
                }
                if (l) {
                    ce = a;
                    for (var we = ve, xe = ge, be = he.length - 2; we[xe] === he[be]; ) xe--, be--;
                    for (;be >= 0; be--) j(he[be], S, e);
                    for (;xe >= 0; xe--) j(we[xe], O, e);
                    he = we;
                }
            }
            var Le, We, Xe, Ye, ze, Me, Re, Te = {};
            for (Le = o; Le; Le = Le.parentNode) if (We = Y.get(Le)) for (var Ee = 0; Ee < We.length; Ee++) (Xe = We[Ee])[1] === n ? (We.splice(Ee--, 1), 
            We.length || (Y.delete(Le), X.has(Le) || me(Le))) : (Re = (Ye = Xe[0]).type) in Te || (Ye.stop && (Te[Re] = !0), 
            ze = Xe[1], Me = Xe[2], (t !== M || b(Ye)) && ze(_(Re, e)));
            for (Le = ue; Le; Le = Le.parentNode) if (We = X.get(Le)) for (var Ie = 0; Ie < We.length; Ie++) if ((Xe = We[Ie])[1] === n) We.splice(Ie--, 1), 
            We.length || (X.delete(Le), Y.has(Le) || me(Le)); else if (!((Re = (Ye = Xe[0]).type) in Te)) switch (Ye.stop && (Te[Re] = !0), 
            ze = Xe[1], Me = Xe[2], Re) {
              case T:
                t === R && k - y < Ye.num && ze(_(Re, e));
                break;

              case E:
                t === R && (k - (Me.s || 0) > Ye.num && (Me.is = 0), (Me.is = 0 | ++Me.is) && (1 === Me.is ? Me.s = y : (Me.is = 0, 
                ze(_(Re, e)))));
                break;

              case "pan":
                (t === M && oe || se) && (se && Me.is || m > Ye.num && b(Ye)) && ((q = se) ? Me.is = !1 : Me.is || (D = Me.is = !0), 
                L(), ze(_(Re, e)), D = q = !1);
                break;

              case I:
              case P:
                t === z && ie.push(Me.sti = setInterval(((e, t, r) => {
                    e === I && clearInterval(r.sti), L(), ze(_(e, t));
                }), Ye.num, Re, e, Me));
            }
            t === R && (G = c, J = h, Z = $ = 0);
        }
    };
    if (t) m = {
        pointerdown: e => {
            fe(e, z, !0);
        },
        pointermove: e => {
            fe(e, M, !0);
        },
        pointerup: e => {
            fe(e, R, !0);
        },
        pointercancel: e => {
            fe(e, R, !0);
        }
    }; else {
        var ve = 0, ge = (e, t) => {
            ++ve >= (ve = 1) && fe(e, t, !0);
        }, de = (e, t) => {
            --ve <= (ve = -1) && fe(e, t, !1);
        };
        m = {
            mousedown: e => {
                ge(e, z);
            },
            mousemove: e => {
                ge(e, M);
            },
            mouseup: e => {
                ge(e, R);
            },
            touchstart: e => {
                de(e, z);
            },
            touchmove: e => {
                de(e, M);
            },
            touchend: e => {
                de(e, R);
            },
            touchcancel: e => {
                de(e, R);
            }
        };
    }
    var ye = [ "click", "dblclick" ];
    for (var ke in m) i(document, ke, m[ke], !1), ye.push(ke);
    var me = e => {
        for (var t = 0; t < ye.length; t++) l(e, ye[t], a);
    }, we = (e, t, s) => {
        var o;
        if (r(t)) {
            var l = [];
            o = () => {
                for (;l.length; ) l.pop()();
            };
            for (var p = 0; p < t.length; p++) l.push(we(e, t[p], s));
        } else {
            var d = [].concat(s), y = h(t), k = y.type, m = !1;
            switch (k) {
              case A:
              case N:
              case O:
              case S:
                o = () => {
                    d.length = 0;
                }, y.once && d.push(o);
                var w = W.get(e) || c(W, e, {});
                k in w ? w[k].push(d) : w[k] = [ d ];
                break;

              case z:
              case M:
              case R:
                m = !0;

              case T:
              case E:
              case "pan":
              case I:
              case P:
                o = () => {
                    d.length = 0, b[1] = n;
                };
                var x = u(d);
                y.once && d.push(o), y.kLen && (x = f(x, y)), y.self && (x = v(x)), y.trusted && (x = g(x)), 
                Y.has(e) || X.has(e) || (e => {
                    for (var t = 0; t < ye.length; t++) i(e, ye[t], a, {
                        passive: !1
                    });
                })(e);
                var b = [ y, x, {} ], L = m ? Y : X;
                (L.get(e) || c(L, e, [])).push(b);
                break;

              default:
                throw t;
            }
        }
        return o;
    };
    return we;
})(), L = {
    resize: w,
    keypad: m,
    native: x,
    cursor: b
};

exports.cursor = b, exports.default = L, exports.keypad = m, exports.native = x, 
exports.resize = w;
