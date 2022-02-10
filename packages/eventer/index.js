/* eslint-disable */
/*
dester builds:
index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e, t, r, i, a, s, n, l, o, p, f, h, u, v = "undefined" != typeof window, d = () => {}, c = () => d, m = Array.isArray, y = "__wseventer__", g = /\((\w+)\)|([A-Z]\w+)|^([a-z]+)|(?<=\W)(?:([.\d]+)|(touch)|(mouse)|(stop)|(prevent)|(self)|(once)|(x|h\w*)|(y|v\w*)|([tu]\w*)|([bd]\w*)|(l\w*)|(r\w*))/g, w = e => {
    var t, r, i, a, s, n, l, o, p, f, h, u, v = "", d = .5;
    t = r = i = a = s = n = l = o = p = f = u = h = !1;
    var c = 0, m = {};
    return e.replace(g, ((e, y, g, w, _, k, x, b, E, A, K, X, Y, I, S, F, P) => (w ? v = w : _ ? d = +_ || d : b ? t = !!b : E ? r = !!E : A ? i = !!A : K ? a = !!K : X ? s = !!X : Y ? n = !!Y : I ? l = !!I : S ? o = !!S : F ? p = !!F : P ? f = !!P : k ? h = !!k : x ? u = !!x : (y || g) && (c++, 
    m[y || g] = 1), ""))), d *= 1e3, m.len = c, {
        type: v,
        time: d,
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
        keys: c ? m : null,
        thme: h || u,
        th: h,
        me: u
    };
}, _ = 1, k = "start", x = "move", b = "end", E = "tap", A = "dbltap", K = "pan", X = "hold", Y = "repeat", I = "focusin", S = "focusout", F = "hoverin", P = "hoverout", j = "up", z = "down", C = "left", D = "right", L = {}, M = [], O = () => {
    if (O = d, v) {
        var e = 0, t = (t, r) => {
            ++e >= (e = 1) && ve(t, r, !0);
        }, r = (t, r) => {
            --e <= (e = -1) && ve(t, r, !1);
        }, i = (e, t) => {
            var r = e.code, i = e.key;
            if (t ? L[r + i] = [ r, i, e.keyCode ] : delete L[r + i], t) for (var a, s = M.length; s-- > 0; ) if ((a = M[s][0]).len) {
                if (R(a)) for (var n = M[s][1], l = n.length; l-- > 0; ) n[l](e);
            } else M.splice(s, 1);
        }, a = {
            mousedown: e => {
                t(e, k);
            },
            mousemove: e => {
                t(e, x);
            },
            mouseup: e => {
                t(e, b);
            },
            touchstart: e => {
                r(e, k);
            },
            touchmove: e => {
                r(e, x);
            },
            touchend: e => {
                r(e, b);
            },
            keydown: e => {
                i(e, !0);
            },
            keyup: e => {
                i(e, !1);
            }
        };
        for (var s in a) document.addEventListener(s, a[s]);
    }
}, R = e => {
    var t = e.len;
    for (var r in L) {
        if (!(L[r][0] in e || L[r][1] in e || L[r][2] in e)) break;
        t--;
    }
    return !t;
}, W = t => !t.xy || e === C && (t.x || t.l) || e === D && (t.x || t.r) || e === j && (t.y || t.u) || e === z && (t.y || t.d), Z = v ? window.getSelection ? () => {
    window.getSelection().removeAllRanges();
} : () => {
    document.selection.empty();
} : d, q = e => e < 0 ? -e : e, B = e => {
    for (var t = 0, r = e.length; r-- > 0; ) t += e[r];
    return t;
}, G = (e, t, r, i) => {
    var a = e[0];
    if (!a.keys || R(a.keys)) for (var s = 0; s < e[1].length; s++) e[1][s](V(t, r, i));
}, H = !1, J = !1, N = !1, Q = !1, T = !1, U = !1, V = (l, o, p) => ({
    type: l,
    direction: e,
    isFirst: T,
    isFinal: U,
    page: {
        x: t,
        y: r
    },
    delta: {
        x: s,
        y: n
    },
    offset: {
        x: i,
        y: a
    },
    key: {
        alt: H,
        ctrl: J,
        meta: N,
        shift: Q
    },
    touch: !o,
    mouse: o,
    evt: p
}), $ = {}, ee = {}, te = !1, re = [], ie = 0, ae = 0, se = 0, ne = 0, le = 0, oe = 0, pe = !1, fe = !1, he = [ 0, 0, 0, 0, 0, 0, 0 ], ue = [ 0, 0, 0, 0, 0, 0, 0 ], ve = (v, d, c) => {
    l = v.target, f = v.timeStamp, H = !!v.altKey, J = !!v.ctrlKey, N = !!v.metaKey, 
    Q = !!v.shiftKey;
    var {clientX: m, clientY: g, pageX: w, pageY: _} = c ? v : v.touches[0] || {
        clientX: se,
        clientY: ne,
        pageX: ie,
        pageY: ae
    };
    pe = !1;
    var L = o, M = p;
    p = l, d === x ? te && !fe && (fe = !0) : (re.forEach(clearInterval), re.length = 0, 
    d === k ? (o = l, te = !0, h = f, se = m, ne = g, le = oe = 0) : (te = !1, u = f, 
    fe && (fe = !(pe = !0)))), s = -se + (se = m), n = -ne + (ne = g), i = le += s, 
    a = oe += n, t = ie = w, r = ae = _;
    var O = 1e3 * (q(i) + q(a));
    he.push(s), ue.push(n), he.shift(), ue.shift();
    var R = B(he), V = B(ue);
    e = q(R) > q(V) ? R < 0 ? C : D : V < 0 ? j : z;
    var ve, de, ce, me, ye, ge, we = L !== o, _e = M !== p, ke = {}, xe = {}, be = {};
    if (we) {
        if (de = o) do {
            if (ve = de[y]) {
                if (ve.id in $) break;
                for (var Ee = ve._.length; Ee-- > 0; ) (ye = (me = (ce = ve._[Ee])[0]).type) ? (!me.thme || me.th === !c && me.me === c) && (ye === I || ye === F && _e && !(ve.id in ee)) && G(ce, ye, c, v) : ve._.splice(Ee, 1);
            }
        } while (de = de.parentElement);
    } else if (_e && (de = p)) do {
        if (ve = de[y]) {
            if (ve.id in ee) break;
            for (var Ae = ve._.length; Ae-- > 0; ) (ye = (me = (ce = ve._[Ae])[0]).type) ? (!me.thme || me.th === !c && me.me === c) && ye === F && G(ce, ye, c, v) : ve._.splice(Ae, 1);
        }
    } while (de = de.parentElement);
    de = l;
    do {
        if (ve = de[y]) {
            ke[ve.id] = !0, xe[ve.id] = !0;
            for (var Ke = ve._.length; Ke-- > 0; ) if (ye = (me = (ce = ve._[Ke])[0]).type, 
            ge = ce[2], ye) {
                if (!(ye in be || me.sf && de !== l || me.thme && (me.th !== !c || me.me !== c))) switch (me.pt && v.preventDefault(), 
                me.sp && (be[ye] = !0, v.stopPropagation()), ye) {
                  case d:
                    (d !== x || W(me)) && G(ce, d, c, v);
                    break;

                  case E:
                    d === b && u - h < me.time && G(ce, ye, c, v);
                    break;

                  case A:
                    d === b && (u - ge.s > me.time && (ge.is = 0), (ge.is = 0 | ++ge.is) && (1 === ge.is ? ge.s = h : (ge.is = 0, 
                    G(ce, ye, c, v))));
                    break;

                  case K:
                    (d === x && te || pe) && (pe && ge.is || O > me.time && W(me)) && ((U = pe) ? ge.is = !1 : ge.is || (T = ge.is = !0), 
                    Z(), G(ce, ye, c, v), T = U = !1);
                    break;

                  case X:
                  case Y:
                    d === k && re.push(ge.sti = setInterval(((e, t, r, i, a) => {
                        t === X && clearInterval(a.sti), Z(), G(e, t, r, i);
                    }), me.time, ce, ye, c, v, ge));
                }
            } else ve._.splice(Ke, 1);
        }
    } while (de = de.parentElement);
    if (we) {
        if (de = L) do {
            if (ve = de[y]) {
                if (ve.id in ke) break;
                for (var Xe = ve._.length; Xe-- > 0; ) (ye = (me = (ce = ve._[Xe])[0]).type) ? (!me.thme || me.th === !c && me.me === c) && (ye === S || ye === P && _e && !(ve.id in xe)) && G(ce, ye, c, v) : ve._.splice(Xe, 1);
            }
        } while (de = de.parentElement);
        $ = ke, ee = xe;
    } else if (_e) {
        if (de = M) do {
            if (ve = de[y]) {
                if (ve.id in xe) break;
                for (var Ye = ve._.length; Ye-- > 0; ) (ye = (me = (ce = ve._[Ye])[0]).type) ? (!me.thme || me.th === !c && me.me === c) && ye === P && G(ce, ye, c, v) : ve._.splice(Ye, 1);
            }
        } while (de = de.parentElement);
        ee = xe;
    }
    d === b && (se = m, ne = g, le = oe = 0);
}, de = (e, t, r) => {
    var i = w(t);
    if (!i.type) throw t;
    var a = (e[y] || (e[y] = {
        id: _++,
        _: []
    }))._, s = a.push([ i, m(r) ? r.slice(0) : [ r ], {} ]), n = () => {
        i.type = "";
    };
    return i.oe && a[s - 1][1].unshift(n), n;
}, ce = (e, t) => {
    var r = w(e), i = r.keys;
    if (!i) throw e;
    var a = M.push([ i, m(t) ? t.slice(0) : [ t ] ]), s = () => {
        i.len = 0;
    };
    return r.oe && M[a - 1][1].unshift(s), s;
}, me = v ? (e, t, r) => {
    O();
    var i = d;
    if (m(t)) {
        for (var a = [], s = 0; s < t.length; s++) a.push(de(e, t[s], r));
        i = () => {
            for (;a.length; ) a.pop()();
        };
    } else i = de(e, t, r);
    return i;
} : c, ye = v ? (e, t) => {
    O();
    var r = d;
    if (m(e)) {
        for (var i = [], a = 0; a < e.length; a++) i.push(ce(e[a], t));
        r = () => {
            for (;i.length; ) i.pop()();
        };
    } else r = ce(e, t);
    return r;
} : c, ge = v ? e => {
    e && y in e && delete e[y];
} : d, we = {
    taps: me,
    keys: ye,
    untaps: ge
};

exports.default = we, exports.keys = ye, exports.taps = me, exports.untaps = ge;
