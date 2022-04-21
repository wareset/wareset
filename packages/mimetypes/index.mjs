/* eslint-disable */
/*
dester builds:
index.ts
*/
import { EXTENSIONS as r, MIME_TYPES as e, MIME_NAMES as i } from "./lib/mimes";

var a = {};

for (var o in r) {
    a[o] = [];
    for (var t = r[o], n = 0, f = 0; f < t.length; f++) a[o][n++] = e[t[f]] + "/" + i[t[f++]][t[f]];
}

var s = r => {
    for (var e, i = "", o = "", t = "", n = "", f = (r = r.trim()).length; f-- > 0; ) {
        if ("." === (e = r[f])) o in a && (i = o) || t in a && (i = t) || n in a && (i = n); else if ("/" === e || "\\" === e) break;
        o = e + o, t = e.toUpperCase() + t, n = e.toLowerCase() + n;
    }
    return i;
}, l = r => (r = s(r)) && "." + r, m = r => (r = s(r)) ? a[r][0] : r, v = r => (r = s(r)) ? a[r].slice(0) : [];

export { a as EXTENSIONS, s as ext, l as extname, m as mime, v as mimeList };
