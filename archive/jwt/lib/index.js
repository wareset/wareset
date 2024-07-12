/* eslint-disable */
/*
dester builds:
lib/index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var [e, o] = [ encodeURIComponent, decodeURIComponent ], r = "undefined" != typeof btoa ? btoa : e => Buffer.from(e).toString("base64"), t = "undefined" != typeof atob ? atob : e => Buffer.from(e, "base64").toString(), n = JSON.stringify, a = JSON.parse;

exports.atob = e => {
    for (var r = "", n = t(e), a = 0; a < n.length; a++) r += "%" + ("00" + n[a].charCodeAt(0).toString(16)).slice(-2);
    return o(r);
}, exports.btoa = o => r(e(o).replace(/%([0-9A-F]{2})/g, ((e, o) => String.fromCharCode(+("0x" + o))))), 
exports.decodeURIComponent = o, exports.encodeURIComponent = e, exports.hashFactory = (e, o) => r => ((e, o, r) => {
    var t, n, a, f, s = [], p = "";
    for (n = 0; n < o; ) s[n] = [ r * ++n, r ];
    for (t = e.length; t-- > 0; ) for (a = e.charCodeAt(t), n = o; n-- > 0; ) (f = s[n])[1] += (++f[0] + a * ++f[1]) / (a + f[1]), 
    f[1] *= f[1] < 5 ? 5 : .5;
    for (n = o; n-- > 0; ) (f = s[n])[1] > 1 && (f[1] -= 0 | f[1]), p += f[1].toString(36).slice(2);
    return p;
})(r, e > 0 ? e : 1, o > 0 ? o : 1), exports.jsonparse = a, exports.stringify = n;
