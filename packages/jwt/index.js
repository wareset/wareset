/* eslint-disable */
/*
dester builds:
index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = require("./lib"), r = r => e.btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/[=]+$/g, "");

Object.defineProperty(exports, "atob", {
    enumerable: !0,
    get: function() {
        return e.atob;
    }
}), Object.defineProperty(exports, "btoa", {
    enumerable: !0,
    get: function() {
        return e.btoa;
    }
}), Object.defineProperty(exports, "hashFactory", {
    enumerable: !0,
    get: function() {
        return e.hashFactory;
    }
}), exports.b642utf8 = r => {
    return e.atob(r.replace(/-/g, "+").replace(/_/g, "/") + (3 === (t = 4 - r.length % 4) ? "===" : 2 === t ? "==" : 1 === t ? "=" : ""));
    var t;
}, exports.createJWT = (t, a, o = {}, n = {}) => {
    var p = e.stringify({
        alg: "HS256",
        typ: "JWT",
        ...n
    }), b = r(p) + "." + r(e.stringify(o));
    return b + "." + r(t(b + a));
}, exports.utf82b64 = r;
