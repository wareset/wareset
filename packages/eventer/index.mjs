/* eslint-disable */
/*
dester builds:
index.ts
*/
var e, t, i, r, a, n, s, l, o, f, h, p, v, u = "undefined" != typeof window, c = () => {}, d = () => c, m = Array.isArray, y = "__wseventer__", g = /\((\w+)\)|([A-Z]\w+)|^([a-z]+)|(?<=\W)(?:([.\d]+)|(touch)|(mouse)|(stop)|(prevent)|(self)|(once)|(x|h\w*)|(y|v\w*)|([tu]\w*)|([bd]\w*)|(l\w*)|(r\w*))/g, w = e => {
    var t, i, r, a, n, s, l, o, f, h, p, v, u = "", c = .5;
    t = i = r = a = n = s = l = o = f = h = v = p = !1;
    var d = 0, m = {};
    return e.replace(g, ((e, y, g, w, _, k, b, x, E, A, K, X, Y, I, S, F, z) => (w ? u = w : _ ? c = +_ || c : x ? t = !!x : E ? i = !!E : A ? r = !!A : K ? a = !!K : X ? n = !!X : Y ? s = !!Y : I ? l = !!I : S ? o = !!S : F ? f = !!F : z ? h = !!z : k ? p = !!k : b ? v = !!b : (y || g) && (d++, 
    m[y || g] = 1), ""))), c *= 1e3, m.len = d, {
        type: u,
        time: c,
        sp: t,
        pt: i,
        sf: r,
        oe: a,
        xy: n || s || l || o || f || h,
        x: n,
        y: s,
        u: l,
        d: o,
        l: f,
        r: h,
        keys: d ? m : null,
        thme: p || v,
        th: p,
        me: v
    };
}, _ = 1, k = "start", b = "move", x = "end", E = "tap", A = "dbltap", K = "pan", X = "hold", Y = "repeat", I = "focusin", S = "focusout", F = "hoverin", z = "hoverout", C = "up", D = "down", L = "left", P = "right", R = {}, W = [], Z = () => {
    if (Z = c, u) {
        var e = 0, t = (t, i) => {
            ++e >= (e = 1) && ue(t, i, !0);
        }, i = (t, i) => {
            --e <= (e = -1) && ue(t, i, !1);
        }, r = (e, t) => {
            var i = e.code, r = e.key;
            if (t ? R[i + r] = [ i, r, e.keyCode ] : delete R[i + r], t) for (var a, n = W.length; n-- > 0; ) if ((a = W[n][0]).len) {
                if (j(a)) for (var s = W[n][1], l = s.length; l-- > 0; ) s[l](e);
            } else W.splice(n, 1);
        }, a = {
            mousedown: e => {
                t(e, k);
            },
            mousemove: e => {
                t(e, b);
            },
            mouseup: e => {
                t(e, x);
            },
            touchstart: e => {
                i(e, k);
            },
            touchmove: e => {
                i(e, b);
            },
            touchend: e => {
                i(e, x);
            },
            keydown: e => {
                r(e, !0);
            },
            keyup: e => {
                r(e, !1);
            }
        };
        for (var n in a) document.addEventListener(n, a[n]);
    }
}, j = e => {
    var t = e.len;
    for (var i in R) {
        if (!(R[i][0] in e || R[i][1] in e || R[i][2] in e)) break;
        t--;
    }
    return !t;
}, q = t => !t.xy || e === L && (t.x || t.l) || e === P && (t.x || t.r) || e === C && (t.y || t.u) || e === D && (t.y || t.d), B = u ? window.getSelection ? () => {
    window.getSelection().removeAllRanges();
} : () => {
    document.selection.empty();
} : c, G = e => e < 0 ? -e : e, H = e => {
    for (var t = 0, i = e.length; i-- > 0; ) t += e[i];
    return t;
}, J = (e, t, i, r) => {
    var a = e[0];
    if (!a.keys || j(a.keys)) for (var n = 0; n < e[1].length; n++) e[1][n](V(t, i, r));
}, M = !1, N = !1, O = !1, Q = !1, T = !1, U = !1, V = (l, o, f) => ({
    type: l,
    direction: e,
    isFirst: T,
    isFinal: U,
    page: {
        x: t,
        y: i
    },
    delta: {
        x: n,
        y: s
    },
    offset: {
        x: r,
        y: a
    },
    key: {
        alt: M,
        ctrl: N,
        meta: O,
        shift: Q
    },
    touch: !o,
    mouse: o,
    evt: f
}), $ = {}, ee = {}, te = !1, ie = [], re = 0, ae = 0, ne = 0, se = 0, le = 0, oe = 0, fe = !1, he = !1, pe = [ 0, 0, 0, 0, 0, 0, 0 ], ve = [ 0, 0, 0, 0, 0, 0, 0 ], ue = (u, c, d) => {
    l = u.target, h = u.timeStamp, M = !!u.altKey, N = !!u.ctrlKey, O = !!u.metaKey, 
    Q = !!u.shiftKey;
    var {clientX: m, clientY: g, pageX: w, pageY: _} = d ? u : u.touches[0] || {
        clientX: ne,
        clientY: se,
        pageX: re,
        pageY: ae
    };
    fe = !1;
    var R = o, W = f;
    f = l, c === b ? te && !he && (he = !0) : (ie.forEach(clearInterval), ie.length = 0, 
    c === k ? (o = l, te = !0, p = h, ne = m, se = g, le = oe = 0) : (te = !1, v = h, 
    he && (he = !(fe = !0)))), n = -ne + (ne = m), s = -se + (se = g), r = le += n, 
    a = oe += s, t = re = w, i = ae = _;
    var Z = 1e3 * (G(r) + G(a));
    pe.push(n), ve.push(s), pe.shift(), ve.shift();
    var j = H(pe), V = H(ve);
    e = G(j) > G(V) ? j < 0 ? L : P : V < 0 ? C : D;
    var ue, ce, de, me, ye, ge, we = R !== o, _e = W !== f, ke = {}, be = {}, xe = {};
    if (we) {
        if (ce = o) do {
            if (ue = ce[y]) {
                if (ue.id in $) break;
                for (var Ee = ue._.length; Ee-- > 0; ) (ye = (me = (de = ue._[Ee])[0]).type) ? (!me.thme || me.th === !d && me.me === d) && (ye === I || ye === F && _e && !(ue.id in ee)) && J(de, ye, d, u) : ue._.splice(Ee, 1);
            }
        } while (ce = ce.parentElement);
    } else if (_e && (ce = f)) do {
        if (ue = ce[y]) {
            if (ue.id in ee) break;
            for (var Ae = ue._.length; Ae-- > 0; ) (ye = (me = (de = ue._[Ae])[0]).type) ? (!me.thme || me.th === !d && me.me === d) && ye === F && J(de, ye, d, u) : ue._.splice(Ae, 1);
        }
    } while (ce = ce.parentElement);
    ce = l;
    do {
        if (ue = ce[y]) {
            ke[ue.id] = !0, be[ue.id] = !0;
            for (var Ke = ue._.length; Ke-- > 0; ) if (ye = (me = (de = ue._[Ke])[0]).type, 
            ge = de[2], ye) {
                if (!(ye in xe || me.sf && ce !== l || me.thme && (me.th !== !d || me.me !== d))) switch (me.pt && u.preventDefault(), 
                me.sp && (xe[ye] = !0, u.stopPropagation()), ye) {
                  case c:
                    (c !== b || q(me)) && J(de, c, d, u);
                    break;

                  case E:
                    c === x && v - p < me.time && J(de, ye, d, u);
                    break;

                  case A:
                    c === x && (v - ge.s > me.time && (ge.is = 0), (ge.is = 0 | ++ge.is) && (1 === ge.is ? ge.s = p : (ge.is = 0, 
                    J(de, ye, d, u))));
                    break;

                  case K:
                    (c === b && te || fe) && (fe && ge.is || Z > me.time && q(me)) && ((U = fe) ? ge.is = !1 : ge.is || (T = ge.is = !0), 
                    B(), J(de, ye, d, u), T = U = !1);
                    break;

                  case X:
                  case Y:
                    c === k && ie.push(ge.sti = setInterval(((e, t, i, r, a) => {
                        t === X && clearInterval(a.sti), B(), J(e, t, i, r);
                    }), me.time, de, ye, d, u, ge));
                }
            } else ue._.splice(Ke, 1);
        }
    } while (ce = ce.parentElement);
    if (we) {
        if (ce = R) do {
            if (ue = ce[y]) {
                if (ue.id in ke) break;
                for (var Xe = ue._.length; Xe-- > 0; ) (ye = (me = (de = ue._[Xe])[0]).type) ? (!me.thme || me.th === !d && me.me === d) && (ye === S || ye === z && _e && !(ue.id in be)) && J(de, ye, d, u) : ue._.splice(Xe, 1);
            }
        } while (ce = ce.parentElement);
        $ = ke, ee = be;
    } else if (_e) {
        if (ce = W) do {
            if (ue = ce[y]) {
                if (ue.id in be) break;
                for (var Ye = ue._.length; Ye-- > 0; ) (ye = (me = (de = ue._[Ye])[0]).type) ? (!me.thme || me.th === !d && me.me === d) && ye === z && J(de, ye, d, u) : ue._.splice(Ye, 1);
            }
        } while (ce = ce.parentElement);
        ee = be;
    }
    c === x && (ne = m, se = g, le = oe = 0);
}, ce = (e, t, i) => {
    var r = w(t);
    if (!r.type) throw t;
    var a = (e[y] || (e[y] = {
        id: _++,
        _: []
    }))._, n = a.push([ r, m(i) ? i.slice(0) : [ i ], {} ]), s = () => {
        r.type = "";
    };
    return r.oe && a[n - 1][1].unshift(s), s;
}, de = (e, t) => {
    var i = w(e), r = i.keys;
    if (!r) throw e;
    var a = W.push([ r, m(t) ? t.slice(0) : [ t ] ]), n = () => {
        r.len = 0;
    };
    return i.oe && W[a - 1][1].unshift(n), n;
}, me = u ? (e, t, i) => {
    Z();
    var r = c;
    if (m(t)) {
        for (var a = [], n = 0; n < t.length; n++) a.push(ce(e, t[n], i));
        r = () => {
            for (;a.length; ) a.pop()();
        };
    } else r = ce(e, t, i);
    return r;
} : d, ye = u ? (e, t) => {
    Z();
    var i = c;
    if (m(e)) {
        for (var r = [], a = 0; a < e.length; a++) r.push(de(e[a], t));
        i = () => {
            for (;r.length; ) r.pop()();
        };
    } else i = de(e, t);
    return i;
} : d, ge = u ? e => {
    e && y in e && delete e[y];
} : c, we = {
    taps: me,
    keys: ye,
    untaps: ge
};

export { we as default, ye as keys, me as taps, ge as untaps };
