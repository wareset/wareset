/* eslint-disable */
/*
dester builds:
index.ts
*/
import { btoa as r, atob as e, stringify as a } from "./lib";

export { atob, btoa, hashFactory } from "./lib";

var t = e => r(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/[=]+$/g, ""), l = r => {
    return e(r.replace(/-/g, "+").replace(/_/g, "/") + (3 === (a = 4 - r.length % 4) ? "===" : 2 === a ? "==" : 1 === a ? "=" : ""));
    var a;
}, p = (r, e, l = {}, p = {}) => {
    var o = a({
        alg: "HS256",
        typ: "JWT",
        ...p
    }), g = t(o) + "." + t(a(l));
    return g + "." + t(r(g + e));
};

export { l as b642utf8, p as createJWT, t as utf82b64 };
