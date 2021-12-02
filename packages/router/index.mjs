/* eslint-disable */
/*
dester builds:
__src__/index.ts
index.ts
*/
import { decodeURIComponent } from '@wareset-utilites/lang/decodeURIComponent';
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify';
import { Boolean } from '@wareset-utilites/lang/Boolean';
import { Object as Object$1 } from '@wareset-utilites/lang/Object';
import { RegExp } from '@wareset-utilites/lang/RegExp';
import { isNaN } from '@wareset-utilites/is/isNaN';
import { esc } from '@wareset-utilites/escape';
var n = Object$1.create,
    h = "get|head|post|put|delete|connect|options|trace|patch",
    a = h.split("|"),
    u = h.toUpperCase().split("|");
a.push("all"), u.push(h);
var c = /^\/+|\/+$/g;

class Router {
  constructor(t, {
    baseUrl: e = "",
    useBefore: s = [],
    useAfter: r = [],
    statusCodes: o = {},
    statusCodesFactory: l = d,
    queryParser: h = f
  } = {}) {
    this.server = void 0;
    this.server = t, this._routes = n(null), s = _(s), r = _(r);
    var p = n(null);

    for (var _n in o) {
      isNaN(+_n) || (p[_n] = _(o[_n]));
    }

    o = p;

    for (var i = 2, _n2 = [404, 500]; i-- > 0;) {
      _n2[i] in o || (o[_n2[i]] = [l(_n2[i])]);
    }

    for (var _i = a.length; _i-- > 0;) {
      this[a[_i]] = this.add.bind(this, u[_i]);
    }

    this.baseUrl = e.replace(c, ""), t.on("request", (t, e) => {
      console.log(t);
      var i = t.method.toUpperCase();
      t.baseUrl = this.baseUrl, t.originalUrl = t.url, t._parsedUrl = new ParsedUrl(t), t.query = null !== t._parsedUrl.query ? h(t._parsedUrl.query) : {};
      var n = t._parsedUrl._routes.length;
      var a,
          u = null;
      if (i in this._routes) t: {
        if (n in this._routes[i]) for (var _e = 0, _s = this._routes[i][n].length; _e < _s; ++_e) {
          if (null !== (u = (a = this._routes[i][n][_e]).regex.exec(t._parsedUrl._route))) break t;
        }

        for (var _e2 = n; _e2 >= 0; --_e2) {
          if (_e2 in this._routes[i][-1]) for (var _s2 = 0, _r = this._routes[i][-1][_e2].length; _s2 < _r; ++_s2) {
            if (null !== (u = (a = this._routes[i][-1][_e2][_s2]).regex.exec(t._parsedUrl._route))) break t;
          }
        }
      }
      var c = [s, o[404], r];
      null !== u ? (void 0 !== u.groups ? t.params = u.groups : t.params = {}, c[1] = a.handlers, console.log("SLUG", t.params, a)) : t.params = {};
      var p = -1,
          _ = 0;

      var d = s => {
        if (null != s) {
          2 === _ && (c[2] = []);

          var _r2 = +s || +s.code || +s.status || 500;

          (c[_ = 1] = _r2 in o ? o[_r2] : o[_r2] = [l(_r2)])[p = 0](t, e, d, s);
        } else ++p in c[_] ? c[_][p](t, e, d) : _ < 2 ? c[++_][p = 0] ? c[_][p](t, e, d) : d() : (c[_ = 1] = o[500])[p = 0](t, e, d);
      };

      d();
    }), this.listen = t.listen.bind(t);
  }

  add(t, e, ...s) {
    var r = p(e, _(...s));

    for (var o, i, l, _h, _a = (t => [].concat(...[].concat(t).map(t => t.trim().toUpperCase().split(/[^-\w]+/))))(t), _u = 0; _u < _a.length; ++_u) {
      (o = _a[_u]) in this._routes || (this._routes[o] = n(null), this._routes[o][-1] = n(null)), i = this._routes[o], l = r.spread ? r.count in i[-1] ? i[-1][r.count] : i[-1][r.count] = [] : r.count in i ? i[r.count] : i[r.count] = [], _h = l.length;

      for (var _t, _e3 = 0; _h-- > 0;) {
        if (l[_h].__dirty === r.__dirty) throw "ROUTER_ERROR: Dublicate route " + r.route + " instead of " + l[_h].route;
        _t = l[_h].id;

        for (var _s3 = 0; _s3 < r.id.length && !(_s3 >= _t.length || 0 != (_e3 = r.id[_s3] - _t[_s3])); ++_s3) {
          ;
        }

        if ((0 !== _e3 ? _e3 : _t.length - r.id.length) > 0) break;
      }

      l.splice(++_h, 0, r);
    }

    return this;
  }

}

var p = (t, e) => {
  var r = [];
  var i = !1,
      n = "^";

  for (var o = 0, _h2 = (t = t.replace(c, "")).split(/\[(.*?(?:\(.+?\))?)\]/); o < _h2.length; ++o) {
    var _e4 = _h2[o];
    if (_e4) if (o % 2 == 0) r.push(-_e4.split("/").filter(Boolean).length), n += esc(_e4);else {
      if (_e4.indexOf("/") > -1) throw "ROUTER_ERROR: Unavailable character \"/\" in route " + t + " in " + _e4;
      var [, s, _o] = /([^(]+)(\(.+\))?$/.exec(_e4);

      var l = 0 === _e4.indexOf("...");

      var _h3 = _o ? 2 : 4;

      l && s && (s = s.slice(3)), _o = (_o || "([^/]+?)").slice(1), s = s ? "(?<" + s + ">" : "(", l ? (_o = "\0%SPREAD_S" + s + "\0%SPREAD_K(?:" + _o + "\0%SPREAD_E", i = !0, _h3++) : _o = s + _o, n += _o, r.push(_h3);
    }
  }

  n += "\\/?$", i && (n = n.replace(/([^/]*?)\0%SPREAD_S(.*?)\0%SPREAD_K(.*?)\0%SPREAD_E/g, (t, e, s, r) => "(?:" + e + s + r + "(?:\\/" + r + ")*))"));
  return {
    id: r,
    route: t,
    count: t.split("/").length,
    spread: i,
    __dirty: n.replace(/\?<.+?>/g, ""),
    handlers: e,
    regex: new RegExp(n)
  };
},
    _ = (...t) => [].concat(...t).filter(t => "function" == typeof t),
    d = t => (s, r, o, i) => {
  r.statusCode = t, r.end(i ? jsonStringify(i, void 0, 2) : "" + t);
},
    f = e => {
  var s = {},
      r = e.indexOf("%") > -1;
  return e.split("&").forEach(e => {
    s[(e = r ? e.split("=").map(decodeURIComponent) : e.split("="))[0]] = e[1] || "";
  }), s;
},
    g = t => {
  if (void 0 !== t && t.length > 0) {
    "string" != typeof t && (t = t[0] || "");
    var e = t.lastIndexOf(",");
    return e > -1 ? t.slice(e + 1).trim() : t.trim();
  }

  return null;
};

class ParsedUrl {
  constructor(e) {
    this._ = void 0;
    this.path = void 0;
    this.pathname = void 0;
    this.search = void 0;
    this.query = void 0;
    this._raw = void 0;
    this._route = void 0;
    this._routes = void 0;
    var s;
    this._ = {
      headers: e.headers,
      encrypted: !(!e.socket.encrypted && !e.connection.encrypted),
      protocol: void 0,
      host: void 0,
      hostname: void 0,
      port: void 0
    }, this._raw = e.url, this.path = this._raw, this.pathname = this._raw, (s = this._raw.indexOf("?")) > -1 ? (this.pathname = this._raw.slice(0, s), this.query = this._raw.slice(s + 1), this.search = "?" + this.query) : this.search = this.query = null, this._route = this.pathname.replace(c, ""), this._route.indexOf("%") > -1 && (this._route = decodeURIComponent(this._route)), this._routes = this._route.split("/");
  }

  get protocol() {
    return void 0 !== this._.protocol ? this._.protocol : this._.protocol = g(this._.headers["x-forwarded-proto"]) || "http" + (this._.encrypted ? "s" : "");
  }

  get host() {
    return void 0 !== this._.host ? this._.host : this._.host = g(this._.headers["x-forwarded-host"]) || g(this._.headers.host) || g(this._.headers[":authority"]) || null;
  }

  get hostname() {
    var t;
    return void 0 !== this._.hostname ? this._.hostname : this._.hostname = this.host ? (t = this._.host.indexOf(":")) > -1 ? this._.host.slice(0, t) : this._.host : null;
  }

  get port() {
    var t;
    return void 0 !== this._.port ? this._.port : this._.port = this.host && (t = this._.host.indexOf(":")) > -1 ? this._.host.slice(t + 1) : null;
  }

}

var createRouter = (...r) => new Router(...r);

export { createRouter, Router as default };
