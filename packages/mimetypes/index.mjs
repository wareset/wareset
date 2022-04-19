/* eslint-disable */
/*
dester builds:
index.ts
*/
import { EXTENSIONS as r, MIME_TYPES as e, MIME_NAMES as i } from "./lib/mimes";

var a = {};

for (var f in r) {
    a[f] = [];
    for (var o = r[f], t = 0, l = 0; l < o.length; l++) a[f][t++] = e[o[l]] + "/" + i[o[l++]][o[l]];
}

var m = r => {
    for (var e, i = "", f = "", o = (r = r.trim()).length; o-- > 0; ) {
        if ("." === (e = r[o])) f in a && (i = f); else if ("/" === e || "\\" === e) break;
        f = e + f;
    }
    return i;
}, n = r => (r = m(r)) && "." + r, v = r => (r = m(r)) ? a[r][0] : r, s = r => (r = m(r)) ? a[r].slice(0) : [];

export { a as EXTENSIONS, m as ext, n as extname, v as mime, s as mimeList };
