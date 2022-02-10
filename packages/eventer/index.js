/* eslint-disable */
/*
dester builds:
index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e, t, r, i, a, s, n, l = "__wseventer__", o = 1, p = "undefined" != typeof window, f = () => {}, h = () => f, u = Array.isArray, v = /\((\w+)\)|([A-Z]\w+)|^([a-z]+)|(?<=\W)(?:([.\d]+)|(touch)|(mouse)|(stop)|(prevent)|(self)|(once)|(x|h\w*)|(y|v\w*)|([tu]\w*)|([bd]\w*)|(l\w*)|(r\w*))/g, d = e => {
    var t, r, i, a, s, n, l, o, p, f, h, u, d = "", c = .5;
    t = r = i = a = s = n = l = o = p = f = u = h = !1;
    var m = 0, y = {};
    return e.replace(v, ((e, v, g, w, _, k, x, b, E, A, K, X, Y, I, S, F, P) => (w ? d = w : _ ? c = +_ || c : b ? t = !!b : E ? r = !!E : A ? i = !!A : K ? a = !!K : X ? s = !!X : Y ? n = !!Y : I ? l = !!I : S ? o = !!S : F ? p = !!F : P ? f = !!P : k ? h = !!k : x ? u = !!x : (v || g) && (m++, 
    y[v || g] = 1), ""))), c *= 1e3, y.len = m, {
        type: d,
        time: c,
        sp: t,
        pt: r,
        sf: i,
        oe: a,
        xy: s || n || l || o || p || f,
        x: s,
        y: n,
        u: l,
        d: o,
        l: p,
        r: f,
        keys: m ? y : null,
        thme: h || u,
        th: h,
        me: u
    };
}, c = [], m = !1, y = !1, g = !1, w = !1, _ = !1, k = !1, x = (l, o, p) => ({
    type: l,
    direction: e,
    isFirst: m,
    isFinal: y,
    page: {
        x: t,
        y: r
    },
    delta: {
        x: i,
        y: a
    },
    offset: {
        x: s,
        y: n
    },
    key: {
        alt: g,
        ctrl: w,
        meta: _,
        shift: k
    },
    touch: !o,
    mouse: o,
    evt: p
}), b = () => {
    if (b = f, p) {
        var o, h, u, v, d, E, A = {}, K = "start", X = "move", Y = "end", I = "hold", S = "hoverin", F = "hoverout", P = "down", j = "left", z = "right", C = e => {
            var t = e.len;
            for (var r in A) {
                if (!(A[r][0] in e || A[r][1] in e || A[r][2] in e)) break;
                t--;
            }
            return !t;
        }, D = t => !t.xy || e === j && (t.x || t.l) || e === z && (t.x || t.r) || "up" === e && (t.y || t.u) || e === P && (t.y || t.d), L = p ? window.getSelection ? () => {
            window.getSelection().removeAllRanges();
        } : () => {
            document.selection.empty();
        } : f, M = e => e < 0 ? -e : e, O = e => {
            for (var t = 0, r = e.length; r-- > 0; ) t += e[r];
            return t;
        }, R = (e, t, r, i) => {
            var a = e[0];
            if (!a.keys || C(a.keys)) for (var s = 0; s < e[1].length; s++) e[1][s](x(t, r, i));
        }, W = {}, Z = {}, q = !1, B = [], G = 0, H = 0, J = 0, N = 0, Q = 0, T = 0, U = !1, V = !1, $ = [ 0, 0, 0, 0, 0, 0, 0 ], ee = [ 0, 0, 0, 0, 0, 0, 0 ], te = (p, f, c) => {
            o = p.target, v = p.timeStamp, g = !!p.altKey, w = !!p.ctrlKey, _ = !!p.metaKey, 
            k = !!p.shiftKey;
            var {clientX: x, clientY: b, pageX: A, pageY: C} = c ? p : p.touches[0] || {
                clientX: J,
                clientY: N,
                pageX: G,
                pageY: H
            };
            U = !1;
            var te = h, re = u;
            u = o, f === X ? q && !V && (V = !0) : (B.forEach(clearInterval), B.length = 0, 
            f === K ? (h = o, q = !0, d = v, J = x, N = b, Q = T = 0) : (q = !1, E = v, V && (V = !(U = !0)))), 
            i = -J + (J = x), a = -N + (N = b), s = Q += i, n = T += a, t = G = A, r = H = C;
            var ie = 1e3 * (M(s) + M(n));
            $.push(i), ee.push(a), $.shift(), ee.shift();
            var ae = O($), se = O(ee);
            e = M(ae) > M(se) ? ae < 0 ? j : z : se < 0 ? "up" : P;
            var ne, le, oe, pe, fe, he, ue = te !== h, ve = re !== u, de = {}, ce = {}, me = {};
            if (ue) {
                if (le = h) do {
                    if (ne = le[l]) {
                        if (ne.id in W) break;
                        for (var ye = ne._.length; ye-- > 0; ) (fe = (pe = (oe = ne._[ye])[0]).type) ? (!pe.thme || pe.th === !c && pe.me === c) && ("focusin" === fe || fe === S && ve && !(ne.id in Z)) && R(oe, fe, c, p) : ne._.splice(ye, 1);
                    }
                } while (le = le.parentElement);
            } else if (ve && (le = u)) do {
                if (ne = le[l]) {
                    if (ne.id in Z) break;
                    for (var ge = ne._.length; ge-- > 0; ) (fe = (pe = (oe = ne._[ge])[0]).type) ? (!pe.thme || pe.th === !c && pe.me === c) && fe === S && R(oe, fe, c, p) : ne._.splice(ge, 1);
                }
            } while (le = le.parentElement);
            le = o;
            do {
                if (ne = le[l]) {
                    de[ne.id] = !0, ce[ne.id] = !0;
                    for (var we = ne._.length; we-- > 0; ) if (fe = (pe = (oe = ne._[we])[0]).type, 
                    he = oe[2], fe) {
                        if (!(fe in me || pe.sf && le !== o || pe.thme && (pe.th !== !c || pe.me !== c))) switch (pe.pt && p.preventDefault(), 
                        pe.sp && (me[fe] = !0, p.stopPropagation()), fe) {
                          case f:
                            (f !== X || D(pe)) && R(oe, f, c, p);
                            break;

                          case "tap":
                            f === Y && E - d < pe.time && R(oe, fe, c, p);
                            break;

                          case "dbltap":
                            f === Y && (E - he.s > pe.time && (he.is = 0), (he.is = 0 | ++he.is) && (1 === he.is ? he.s = d : (he.is = 0, 
                            R(oe, fe, c, p))));
                            break;

                          case "pan":
                            (f === X && q || U) && (U && he.is || ie > pe.time && D(pe)) && ((y = U) ? he.is = !1 : he.is || (m = he.is = !0), 
                            L(), R(oe, fe, c, p), m = y = !1);
                            break;

                          case I:
                          case "repeat":
                            f === K && B.push(he.sti = setInterval(((e, t, r, i, a) => {
                                t === I && clearInterval(a.sti), L(), R(e, t, r, i);
                            }), pe.time, oe, fe, c, p, he));
                        }
                    } else ne._.splice(we, 1);
                }
            } while (le = le.parentElement);
            if (ue) {
                if (le = te) do {
                    if (ne = le[l]) {
                        if (ne.id in de) break;
                        for (var _e = ne._.length; _e-- > 0; ) (fe = (pe = (oe = ne._[_e])[0]).type) ? (!pe.thme || pe.th === !c && pe.me === c) && ("focusout" === fe || fe === F && ve && !(ne.id in ce)) && R(oe, fe, c, p) : ne._.splice(_e, 1);
                    }
                } while (le = le.parentElement);
                W = de, Z = ce;
            } else if (ve) {
                if (le = re) do {
                    if (ne = le[l]) {
                        if (ne.id in ce) break;
                        for (var ke = ne._.length; ke-- > 0; ) (fe = (pe = (oe = ne._[ke])[0]).type) ? (!pe.thme || pe.th === !c && pe.me === c) && fe === F && R(oe, fe, c, p) : ne._.splice(ke, 1);
                    }
                } while (le = le.parentElement);
                Z = ce;
            }
            f === Y && (J = x, N = b, Q = T = 0);
        }, re = 0, ie = (e, t) => {
            ++re >= (re = 1) && te(e, t, !0);
        }, ae = (e, t) => {
            --re <= (re = -1) && te(e, t, !1);
        }, se = (e, t) => {
            var r = e.code, i = e.key;
            if (t ? A[r + i] = [ r, i, e.keyCode ] : delete A[r + i], t) for (var a, s = c.length; s-- > 0; ) if ((a = c[s][0]).len) {
                if (C(a)) for (var n = c[s][1], l = n.length; l-- > 0; ) n[l](e);
            } else c.splice(s, 1);
        }, ne = {
            mousedown: e => {
                ie(e, K);
            },
            mousemove: e => {
                ie(e, X);
            },
            mouseup: e => {
                ie(e, Y);
            },
            touchstart: e => {
                ae(e, K);
            },
            touchmove: e => {
                ae(e, X);
            },
            touchend: e => {
                ae(e, Y);
            },
            keydown: e => {
                se(e, !0);
            },
            keyup: e => {
                se(e, !1);
            }
        };
        for (var le in ne) document.addEventListener(le, ne[le]);
    }
}, E = (e, t, r) => {
    var i = d(t);
    if (!i.type) throw t;
    var a = (e[l] || (e[l] = {
        id: o++,
        _: []
    }))._, s = a.push([ i, u(r) ? r.slice(0) : [ r ], {} ]), n = () => {
        i.type = "";
    };
    return i.oe && a[s - 1][1].unshift(n), n;
}, A = (e, t) => {
    var r = d(e), i = r.keys;
    if (!i) throw e;
    var a = c.push([ i, u(t) ? t.slice(0) : [ t ] ]), s = () => {
        i.len = 0;
    };
    return r.oe && c[a - 1][1].unshift(s), s;
}, K = p ? (e, t, r) => {
    b();
    var i = f;
    if (u(t)) {
        for (var a = [], s = 0; s < t.length; s++) a.push(E(e, t[s], r));
        i = () => {
            for (;a.length; ) a.pop()();
        };
    } else i = E(e, t, r);
    return i;
} : h, X = p ? (e, t) => {
    b();
    var r = f;
    if (u(e)) {
        for (var i = [], a = 0; a < e.length; a++) i.push(A(e[a], t));
        r = () => {
            for (;i.length; ) i.pop()();
        };
    } else r = A(e, t);
    return r;
} : h, Y = p ? e => {
    e && l in e && delete e[l];
} : f, I = {
    taps: K,
    keys: X,
    untaps: Y
};

exports.default = I, exports.keys = X, exports.taps = K, exports.untaps = Y;
