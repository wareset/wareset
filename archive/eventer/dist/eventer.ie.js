/* eslint-disable */
/**
 * @license
 * Copyright 2020-2022 @wareset/store Authors
 * SPDX-License-Identifier: MIT
 */
var eventer = (function (exports) {
    'use strict';

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
    var e = "undefined" != typeof window,
        t = e && "onpointermove" in document,
        r = Array.isArray,
        n = function n() {},
        s = function s() {
      return n;
    },
        a = function a(e) {
      e.preventDefault();
    },
        o = function o(e) {
      e.stopPropagation();
    },
        i = function i(e, t, r, n) {
      e.addEventListener(t, r, n);
    },
        l = function l(e, t, r) {
      e.removeEventListener(t, r);
    },
        c = function c(e, t, r) {
      return e.set(t, r), r;
    },
        h = /^([a-z]+)|([.\d]+)|\(([^)]+)\)|\[([^\]]+)\]|(?<=\W)(\w+)/g,
        p = function p(e) {
      var t,
          r,
          n = {
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

      for (h.lastIndex = 0; t = h.exec(e);) {
        (r = t[1]) ? n.type = r : (r = t[2]) && (n.num = 1e3 * +r), (r = t[3]) || (r = t[4]) ? (n.kLen++, n.keys[r] = 1) : (r = t[5]) && (r in n || (r = r[0]) in n) && (n[r] = !0);
      }

      return n.xy = n.x || n.y || n.u || n.d || n.l || n.r, n;
    },
        u = function u(e) {
      return function (t) {
        for (var r = 0; r < e.length; r++) {
          e[r].call(this, t);
        }
      };
    },
        f = function f(e, t) {
      return function (r) {
        d(t) && e.call(this, r);
      };
    },
        v = function v(e) {
      return function (t) {
        t.target === this && e.call(this, t);
      };
    },
        g = function g(e) {
      return function (t) {
        t.isTrusted && e.call(this, t);
      };
    },
        d = function d(e) {
      var t = e.kLen;

      for (var r in y) {
        if (!(y[r][0] in e.keys) && !(y[r][1] in e.keys)) break;
        t--;
      }

      return t <= 0;
    },
        y = {},
        k = [];

    (function () {
      if (e) {
        i(document, "keyup", function (e) {
          delete y[e.code + e.key];
        }, !1), i(document, "keydown", function (e) {
          y[e.code + e.key] = [e.code, e.key];

          for (var t = 0; t < k.length; t++) {
            k[t][0].kLen ? ("test" === k[t][0].type || d(k[t][0])) && k[t][1](e) : k.splice(t--, 1);
          }
        }, !1);
      }
    })();

    var m = e ? function (e, t) {
      var n;

      if (r(e)) {
        for (var s = [], i = 0; i < e.length; i++) {
          s.push(m(e[i], t));
        }

        n = function n() {
          for (; s.length;) {
            s.pop()();
          }
        };
      } else {
        var l = [].concat(t),
            c = p(e);
        c.kLen || (c.kLen = 1, c.type = "test"), n = function n() {
          c.kLen = l.length = 0;
        };
        var h = u(l);
        c.once && l.push(n), c.stop && l.unshift(o), c.prevent && l.unshift(a), c.trusted && (h = g(h)), k.push([c, h]);
      }

      return n;
    } : s,
        w = function () {
      if (!e) return s;

      var t,
          r = new WeakMap(),
          a = function a(e) {
        return "offsetWidth" in e ? [e.offsetWidth, e.offsetHeight] : [e.clientWidth, e.clientHeight];
      },
          o = function o(e) {
        var n = r.get(e),
            _a = a(e),
            s = _a[0],
            o = _a[1];

        if (n[2][0] !== s || n[2][1] !== o) {
          n[2][0] = s, n[2][1] = o;
          var i = n[1] = e.getBoundingClientRect();
          s = i.right - i.left, o = i.bottom - i.top;

          for (var l = 0; l < n[0].length; l++) {
            for (var c = n[0][l], h = 0; h < c.length; h++) {
              c[h]({
                target: e,
                width: s,
                height: o,
                top: i.top,
                left: i.left
              }), c.length || (n[0].splice(l--, 1), n[0].length || (t.unobserve(e), r.delete(e)));
            }
          }
        }
      },
          _i = function i() {
        if (_i = n, "undefined" != typeof ResizeObserver) t = new ResizeObserver(function (e) {
          for (var t = 0; t < e.length; t++) {
            o(e[t].target);
          }
        });else {
          var e,
              r = [0],
              s = [],
              a = setTimeout,
              l = clearTimeout,
              c = function c() {
            for (l(e), r[0] = 0; r[0] < s.length; r[0]++) {
              o(s[r[0]]);
            }

            s.length && (e = a(c, 20));
          };

          document.addEventListener("visibilitychange", function () {
            document.hidden ? l(e) : c();
          }, !1), (t = {}).observe = function (e) {
            s.push(e), a(c, 20);
          }, t.unobserve = function () {
            s.splice(r[0]--, 1);
          };
        }
      };

      return function (e, n, s) {
        if (s === void 0) {
          s = !0;
        }

        _i();

        var o,
            l = [].concat(n),
            h = r.get(e) || (t.observe(e), c(r, e, [[], e.getBoundingClientRect(), a(e)]));
        if (h[0].push(l), s) for (var p = (o = h[1]).right - o.left, u = o.bottom - o.top, f = 0; f < l.length; f++) {
          l[f]({
            target: e,
            width: p,
            height: u,
            top: o.top,
            left: o.left
          });
        }
        return function () {
          l.length = 0;
        };
      };
    }(),
        b = e ? function (e, t, n) {
      var s;

      if (r(t)) {
        for (var c = [], h = 0; h < t.length; h++) {
          c.push(b(e, t[h], n));
        }

        s = function s() {
          for (; c.length;) {
            c.pop()();
          }
        };
      } else {
        var d = [].concat(n),
            y = p(t);
        if (!y.type) throw t;

        s = function s() {
          d.length = 0, l(e, y.type, k);
        };

        var k = u(d);
        y.once && d.push(s), y.stop && d.unshift(o), y.prevent && d.unshift(a), y.kLen && (k = f(k, y)), y.self && (k = v(k)), y.trusted && (k = g(k)), i(e, y.type, k, {
          passive: y.passive,
          capture: y.capture
        });
      }

      return s;
    } : s,
        x = function () {
      if (!e) return s;

      var o,
          h,
          d,
          y,
          k,
          m,
          w = function w(e) {
        return e < 0 ? -e : e;
      },
          b = function b(e) {
        for (var t = 0, r = e.length; r-- > 0;) {
          t += e[r];
        }

        return t;
      },
          x = function x(e) {
        return !e.xy || h === H && (e.x || e.l) || h === O && (e.x || e.r) || h === C && (e.y || e.u) || h === F && (e.y || e.d);
      },
          L = e ? window.getSelection ? function () {
        window.getSelection().removeAllRanges();
      } : function () {
        document.selection.empty();
      } : n,
          W = new WeakMap(),
          X = new WeakMap(),
          Y = new WeakMap(),
          R = "start",
          T = "move",
          z = "end",
          E = "click",
          I = "dblclick",
          M = "press",
          A = "repeat",
          N = "hoverin",
          P = "hoverout",
          S = "focusin",
          B = "focusout",
          C = "up",
          F = "down",
          H = "left",
          O = "right",
          D = function D(e, t) {
        return {
          type: e,
          target: o,
          direction: h,
          isFirst: q,
          isFinal: G,
          page: {
            x: V,
            y: Z
          },
          delta: {
            x: ee,
            y: te
          },
          offset: {
            x: $,
            y: _
          },
          client: {
            x: J,
            y: K
          },
          screen: {
            x: Q,
            y: U
          },
          isTrusted: t.isTrusted,
          event: t
        };
      },
          j = function j(e, t, r) {
        var n = W.get(e);

        if (n && t in n) {
          for (var s, a = n[t], o = 0; s = a[o], o < a.length; o++) {
            for (var i = 0; i < s.length; i++) {
              s[i](D(t, r));
            }

            s.length || a.splice(o--, 1);
          }

          a.length || delete n[t];
        }
      },
          q = !1,
          G = !1,
          J = 0,
          K = 0,
          Q = 0,
          U = 0,
          V = 0,
          Z = 0,
          $ = 0,
          _ = 0,
          ee = 0,
          te = 0,
          re = [0, 0, 0, 0, 0],
          ne = [0, 0, 0, 0, 0],
          se = !1,
          ae = !1,
          oe = !1,
          ie = [],
          le = {},
          ce = {},
          he = [],
          pe = [],
          ue = {},
          fe = function fe(e, t, r) {
        if (r || 1 === e.touches.length) {
          var s = o = e.target,
              a = t !== T ? s : ce,
              i = le !== s,
              l = ce !== a,
              _ref = r ? e : e.touches[0] || {
            clientX: J,
            clientY: K,
            pageX: V,
            pageY: Z,
            screenX: Q,
            screenY: U
          },
              c = _ref.clientX,
              p = _ref.clientY,
              u = _ref.pageX,
              f = _ref.pageY,
              v = _ref.screenX,
              g = _ref.screenY;

          d = e.timeStamp, se = !1, t === T ? oe && !ae && (ae = !0) : (ie.forEach(clearInterval), ie.length = 0, t === R ? (ue = o, oe = !0, y = d, J = c, K = p, $ = _ = 0) : (oe = !1, k = d, ae && (ae = !(se = !0)))), ee = -J + (J = c), te = -K + (K = p), _ += te, Q = v, U = g, V = u, Z = f;
          var m = 1e3 * (w($ += ee) + w(_));
          re.shift(), ne.shift(), re.push(ee), ne.push(te);
          var W = b(re),
              fe = b(ne);

          if (h = w(W) > w(fe) ? W < 0 ? H : O : fe < 0 ? C : F, i || l) {
            var ve = e.composedPath && e.composedPath() || function (e) {
              var t = [],
                  r = e.target;

              do {
                t.push(r);
              } while (r = r.parentNode);

              return t.push(window), t;
            }(e),
                ge = ve.length - 2;

            if (i) {
              le = s;

              for (var de = ve, ye = ge, ke = he.length - 2; de[ye] === he[ke];) {
                ye--, ke--;
              }

              for (; ke >= 0; ke--) {
                j(he[ke], P, e);
              }

              for (; ye >= 0; ye--) {
                j(de[ye], N, e);
              }

              he = de;
            }

            if (l) {
              ce = a;

              for (var we = ve, be = ge, xe = pe.length - 2; we[be] === pe[xe];) {
                be--, xe--;
              }

              for (; xe >= 0; xe--) {
                j(pe[xe], B, e);
              }

              for (; be >= 0; be--) {
                j(we[be], S, e);
              }

              pe = we;
            }
          }

          var Le,
              We,
              Xe,
              Ye,
              Re,
              Te,
              ze,
              Ee = {};

          for (Le = o; Le; Le = Le.parentNode) {
            if (We = Y.get(Le)) for (var Ie = 0; Ie < We.length; Ie++) {
              (Xe = We[Ie])[1] === n ? (We.splice(Ie--, 1), We.length || (Y.delete(Le), X.has(Le) || me(Le))) : (ze = (Ye = Xe[0]).type) in Ee || (Ye.stop && (Ee[ze] = !0), Re = Xe[1], Te = Xe[2], (t !== T || x(Ye)) && Re(D(ze, e)));
            }
          }

          for (Le = ue; Le; Le = Le.parentNode) {
            if (We = X.get(Le)) for (var Me = 0; Me < We.length; Me++) {
              if ((Xe = We[Me])[1] === n) We.splice(Me--, 1), We.length || (X.delete(Le), Y.has(Le) || me(Le));else if (!((ze = (Ye = Xe[0]).type) in Ee)) switch (Ye.stop && (Ee[ze] = !0), Re = Xe[1], Te = Xe[2], ze) {
                case E:
                  t === z && k - y < Ye.num && Re(D(ze, e));
                  break;

                case I:
                  t === z && (k - (Te.s || 0) > Ye.num && (Te.is = 0), (Te.is = 0 | ++Te.is) && (1 === Te.is ? Te.s = y : (Te.is = 0, Re(D(ze, e)))));
                  break;

                case "pan":
                  (t === T && oe || se) && (se && Te.is || m > Ye.num && x(Ye)) && ((G = se) ? Te.is = !1 : Te.is || (q = Te.is = !0), L(), Re(D(ze, e)), q = G = !1);
                  break;

                case M:
                case A:
                  t === R && ie.push(Te.sti = setInterval(function (e, t, r) {
                    e === M && clearInterval(r.sti), L(), Re(D(e, t));
                  }, Ye.num, ze, e, Te));
              }
            }
          }

          t === z && (J = c, K = p, $ = _ = 0);
        }
      };

      if (t) m = {
        pointerdown: function pointerdown(e) {
          fe(e, R, !0);
        },
        pointermove: function pointermove(e) {
          fe(e, T, !0);
        },
        pointerup: function pointerup(e) {
          fe(e, z, !0);
        },
        pointercancel: function pointercancel(e) {
          fe(e, z, !0);
        }
      };else {
        var ve = 0,
            ge = function ge(e, t) {
          ++ve >= (ve = 1) && fe(e, t, !0);
        },
            de = function de(e, t) {
          --ve <= (ve = -1) && fe(e, t, !1);
        };

        m = {
          mousedown: function mousedown(e) {
            ge(e, R);
          },
          mousemove: function mousemove(e) {
            ge(e, T);
          },
          mouseup: function mouseup(e) {
            ge(e, z);
          },
          touchstart: function touchstart(e) {
            de(e, R);
          },
          touchmove: function touchmove(e) {
            de(e, T);
          },
          touchend: function touchend(e) {
            de(e, z);
          },
          touchcancel: function touchcancel(e) {
            de(e, z);
          }
        };
      }
      var ye = ["click", "dblclick"];

      for (var ke in m) {
        i(document, ke, m[ke], !1), ye.push(ke);
      }

      var me = function me(e) {
        for (var t = 0; t < ye.length; t++) {
          l(e, ye[t], a);
        }
      },
          we = function we(e, t, s) {
        var o;

        if (r(t)) {
          var l = [];

          o = function o() {
            for (; l.length;) {
              l.pop()();
            }
          };

          for (var h = 0; h < t.length; h++) {
            l.push(we(e, t[h], s));
          }
        } else {
          var d = [].concat(s),
              y = p(t),
              k = y.type,
              m = !1;

          switch (k) {
            case N:
            case P:
            case S:
            case B:
              o = function o() {
                d.length = 0;
              }, y.once && d.push(o);
              var w = W.get(e) || c(W, e, {});
              k in w ? w[k].push(d) : w[k] = [d];
              break;

            case R:
            case T:
            case z:
              m = !0;

            case E:
            case I:
            case "pan":
            case M:
            case A:
              o = function o() {
                d.length = 0, x[1] = n;
              };

              var b = u(d);
              y.once && d.push(o), y.kLen && (b = f(b, y)), y.self && (b = v(b)), y.trusted && (b = g(b)), Y.has(e) || X.has(e) || function (e) {
                for (var t = 0; t < ye.length; t++) {
                  i(e, ye[t], a, {
                    passive: !1
                  });
                }
              }(e);
              var x = [y, b, {}],
                  L = m ? Y : X;
              (L.get(e) || c(L, e, [])).push(x);
              break;

            default:
              throw t;
          }
        }

        return o;
      };

      return we;
    }(),
        L = {
      resize: w,
      keypad: m,
      native: b,
      cursor: x
    };

    exports.cursor = x;
    exports["default"] = L;
    exports.keypad = m;
    exports.native = b;
    exports.resize = w;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
