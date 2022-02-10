/* eslint-disable */
/*
dester builds:
index.ts
*/
var e, t, i, r, a, n, s, l = "__wseventer__", o = 1, f = "undefined" != typeof window, p = () => {}, h = () => p, v = Array.isArray, u = /\((\w+)\)|([A-Z]\w+)|^([a-z]+)|(?<=\W)(?:([.\d]+)|(touch)|(mouse)|(stop)|(prevent)|(self)|(once)|(x|h\w*)|(y|v\w*)|([tu]\w*)|([bd]\w*)|(l\w*)|(r\w*))/g, c = e => {
    var t, i, r, a, n, s, l, o, f, p, h, v, c = "", d = .5;
    t = i = r = a = n = s = l = o = f = p = v = h = !1;
    var m = 0, y = {};
    return e.replace(u, ((e, u, g, w, _, k, b, x, E, A, K, X, Y, I, S, F, z) => (w ? c = w : _ ? d = +_ || d : x ? t = !!x : E ? i = !!E : A ? r = !!A : K ? a = !!K : X ? n = !!X : Y ? s = !!Y : I ? l = !!I : S ? o = !!S : F ? f = !!F : z ? p = !!z : k ? h = !!k : b ? v = !!b : (u || g) && (m++, 
    y[u || g] = 1), ""))), d *= 1e3, y.len = m, {
        type: c,
        time: d,
        sp: t,
        pt: i,
        sf: r,
        oe: a,
        xy: n || s || l || o || f || p,
        x: n,
        y: s,
        u: l,
        d: o,
        l: f,
        r: p,
        keys: m ? y : null,
        thme: h || v,
        th: h,
        me: v
    };
}, d = [], m = !1, y = !1, g = !1, w = !1, _ = !1, k = !1, b = (l, o, f) => ({
    type: l,
    direction: e,
    isFirst: m,
    isFinal: y,
    page: {
        x: t,
        y: i
    },
    delta: {
        x: r,
        y: a
    },
    offset: {
        x: n,
        y: s
    },
    key: {
        alt: g,
        ctrl: w,
        meta: _,
        shift: k
    },
    touch: !o,
    mouse: o,
    evt: f
}), x = () => {
    if (x = p, f) {
        var o, h, v, u, c, E, A = {}, K = "start", X = "move", Y = "end", I = "hold", S = "hoverin", F = "hoverout", z = "down", C = "left", D = "right", L = e => {
            var t = e.len;
            for (var i in A) {
                if (!(A[i][0] in e || A[i][1] in e || A[i][2] in e)) break;
                t--;
            }
            return !t;
        }, P = t => !t.xy || e === C && (t.x || t.l) || e === D && (t.x || t.r) || "up" === e && (t.y || t.u) || e === z && (t.y || t.d), R = f ? window.getSelection ? () => {
            window.getSelection().removeAllRanges();
        } : () => {
            document.selection.empty();
        } : p, W = e => e < 0 ? -e : e, Z = e => {
            for (var t = 0, i = e.length; i-- > 0; ) t += e[i];
            return t;
        }, j = (e, t, i, r) => {
            var a = e[0];
            if (!a.keys || L(a.keys)) for (var n = 0; n < e[1].length; n++) e[1][n](b(t, i, r));
        }, q = {}, B = {}, G = !1, H = [], J = 0, M = 0, N = 0, O = 0, Q = 0, T = 0, U = !1, V = !1, $ = [ 0, 0, 0, 0, 0, 0, 0 ], ee = [ 0, 0, 0, 0, 0, 0, 0 ], te = (f, p, d) => {
            o = f.target, u = f.timeStamp, g = !!f.altKey, w = !!f.ctrlKey, _ = !!f.metaKey, 
            k = !!f.shiftKey;
            var {clientX: b, clientY: x, pageX: A, pageY: L} = d ? f : f.touches[0] || {
                clientX: N,
                clientY: O,
                pageX: J,
                pageY: M
            };
            U = !1;
            var te = h, ie = v;
            v = o, p === X ? G && !V && (V = !0) : (H.forEach(clearInterval), H.length = 0, 
            p === K ? (h = o, G = !0, c = u, N = b, O = x, Q = T = 0) : (G = !1, E = u, V && (V = !(U = !0)))), 
            r = -N + (N = b), a = -O + (O = x), n = Q += r, s = T += a, t = J = A, i = M = L;
            var re = 1e3 * (W(n) + W(s));
            $.push(r), ee.push(a), $.shift(), ee.shift();
            var ae = Z($), ne = Z(ee);
            e = W(ae) > W(ne) ? ae < 0 ? C : D : ne < 0 ? "up" : z;
            var se, le, oe, fe, pe, he, ve = te !== h, ue = ie !== v, ce = {}, de = {}, me = {};
            if (ve) {
                if (le = h) do {
                    if (se = le[l]) {
                        if (se.id in q) break;
                        for (var ye = se._.length; ye-- > 0; ) (pe = (fe = (oe = se._[ye])[0]).type) ? (!fe.thme || fe.th === !d && fe.me === d) && ("focusin" === pe || pe === S && ue && !(se.id in B)) && j(oe, pe, d, f) : se._.splice(ye, 1);
                    }
                } while (le = le.parentElement);
            } else if (ue && (le = v)) do {
                if (se = le[l]) {
                    if (se.id in B) break;
                    for (var ge = se._.length; ge-- > 0; ) (pe = (fe = (oe = se._[ge])[0]).type) ? (!fe.thme || fe.th === !d && fe.me === d) && pe === S && j(oe, pe, d, f) : se._.splice(ge, 1);
                }
            } while (le = le.parentElement);
            le = o;
            do {
                if (se = le[l]) {
                    ce[se.id] = !0, de[se.id] = !0;
                    for (var we = se._.length; we-- > 0; ) if (pe = (fe = (oe = se._[we])[0]).type, 
                    he = oe[2], pe) {
                        if (!(pe in me || fe.sf && le !== o || fe.thme && (fe.th !== !d || fe.me !== d))) switch (fe.pt && f.preventDefault(), 
                        fe.sp && (me[pe] = !0, f.stopPropagation()), pe) {
                          case p:
                            (p !== X || P(fe)) && j(oe, p, d, f);
                            break;

                          case "tap":
                            p === Y && E - c < fe.time && j(oe, pe, d, f);
                            break;

                          case "dbltap":
                            p === Y && (E - he.s > fe.time && (he.is = 0), (he.is = 0 | ++he.is) && (1 === he.is ? he.s = c : (he.is = 0, 
                            j(oe, pe, d, f))));
                            break;

                          case "pan":
                            (p === X && G || U) && (U && he.is || re > fe.time && P(fe)) && ((y = U) ? he.is = !1 : he.is || (m = he.is = !0), 
                            R(), j(oe, pe, d, f), m = y = !1);
                            break;

                          case I:
                          case "repeat":
                            p === K && H.push(he.sti = setInterval(((e, t, i, r, a) => {
                                t === I && clearInterval(a.sti), R(), j(e, t, i, r);
                            }), fe.time, oe, pe, d, f, he));
                        }
                    } else se._.splice(we, 1);
                }
            } while (le = le.parentElement);
            if (ve) {
                if (le = te) do {
                    if (se = le[l]) {
                        if (se.id in ce) break;
                        for (var _e = se._.length; _e-- > 0; ) (pe = (fe = (oe = se._[_e])[0]).type) ? (!fe.thme || fe.th === !d && fe.me === d) && ("focusout" === pe || pe === F && ue && !(se.id in de)) && j(oe, pe, d, f) : se._.splice(_e, 1);
                    }
                } while (le = le.parentElement);
                q = ce, B = de;
            } else if (ue) {
                if (le = ie) do {
                    if (se = le[l]) {
                        if (se.id in de) break;
                        for (var ke = se._.length; ke-- > 0; ) (pe = (fe = (oe = se._[ke])[0]).type) ? (!fe.thme || fe.th === !d && fe.me === d) && pe === F && j(oe, pe, d, f) : se._.splice(ke, 1);
                    }
                } while (le = le.parentElement);
                B = de;
            }
            p === Y && (N = b, O = x, Q = T = 0);
        }, ie = 0, re = (e, t) => {
            ++ie >= (ie = 1) && te(e, t, !0);
        }, ae = (e, t) => {
            --ie <= (ie = -1) && te(e, t, !1);
        }, ne = (e, t) => {
            var i = e.code, r = e.key;
            if (t ? A[i + r] = [ i, r, e.keyCode ] : delete A[i + r], t) for (var a, n = d.length; n-- > 0; ) if ((a = d[n][0]).len) {
                if (L(a)) for (var s = d[n][1], l = s.length; l-- > 0; ) s[l](e);
            } else d.splice(n, 1);
        }, se = {
            mousedown: e => {
                re(e, K);
            },
            mousemove: e => {
                re(e, X);
            },
            mouseup: e => {
                re(e, Y);
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
                ne(e, !0);
            },
            keyup: e => {
                ne(e, !1);
            }
        };
        for (var le in se) document.addEventListener(le, se[le]);
    }
}, E = (e, t, i) => {
    var r = c(t);
    if (!r.type) throw t;
    var a = (e[l] || (e[l] = {
        id: o++,
        _: []
    }))._, n = a.push([ r, v(i) ? i.slice(0) : [ i ], {} ]), s = () => {
        r.type = "";
    };
    return r.oe && a[n - 1][1].unshift(s), s;
}, A = (e, t) => {
    var i = c(e), r = i.keys;
    if (!r) throw e;
    var a = d.push([ r, v(t) ? t.slice(0) : [ t ] ]), n = () => {
        r.len = 0;
    };
    return i.oe && d[a - 1][1].unshift(n), n;
}, K = f ? (e, t, i) => {
    x();
    var r = p;
    if (v(t)) {
        for (var a = [], n = 0; n < t.length; n++) a.push(E(e, t[n], i));
        r = () => {
            for (;a.length; ) a.pop()();
        };
    } else r = E(e, t, i);
    return r;
} : h, X = f ? (e, t) => {
    x();
    var i = p;
    if (v(e)) {
        for (var r = [], a = 0; a < e.length; a++) r.push(A(e[a], t));
        i = () => {
            for (;r.length; ) r.pop()();
        };
    } else i = A(e, t);
    return i;
} : h, Y = f ? e => {
    e && l in e && delete e[l];
} : p, I = {
    taps: K,
    keys: X,
    untaps: Y
};

export { I as default, X as keys, K as taps, Y as untaps };
