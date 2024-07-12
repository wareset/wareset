/* eslint-disable */
/*
dester builds:
lib/index.ts
*/
var [o, e] = [ encodeURIComponent, decodeURIComponent ], r = "undefined" != typeof btoa ? btoa : o => Buffer.from(o).toString("base64"), t = "undefined" != typeof atob ? atob : o => Buffer.from(o, "base64").toString(), n = e => r(o(e).replace(/%([0-9A-F]{2})/g, ((o, e) => String.fromCharCode(+("0x" + e))))), a = o => {
    for (var r = "", n = t(o), a = 0; a < n.length; a++) r += "%" + ("00" + n[a].charCodeAt(0).toString(16)).slice(-2);
    return e(r);
}, f = JSON.stringify, d = JSON.parse, i = (o, e) => r => ((o, e, r) => {
    var t, n, a, f, d = [], i = "";
    for (n = 0; n < e; ) d[n] = [ r * ++n, r ];
    for (t = o.length; t-- > 0; ) for (a = o.charCodeAt(t), n = e; n-- > 0; ) (f = d[n])[1] += (++f[0] + a * ++f[1]) / (a + f[1]), 
    f[1] *= f[1] < 5 ? 5 : .5;
    for (n = e; n-- > 0; ) (f = d[n])[1] > 1 && (f[1] -= 0 | f[1]), i += f[1].toString(36).slice(2);
    return i;
})(r, o > 0 ? o : 1, e > 0 ? e : 1);

export { a as atob, n as btoa, e as decodeURIComponent, o as encodeURIComponent, i as hashFactory, d as jsonparse, f as stringify };
