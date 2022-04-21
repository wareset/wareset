/* eslint-disable */
/*
dester builds:
index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = require("./lib/mimes"), r = {};

for (var t in e.EXTENSIONS) {
    r[t] = [];
    for (var i = e.EXTENSIONS[t], o = 0, s = 0; s < i.length; s++) r[t][o++] = e.MIME_TYPES[i[s]] + "/" + e.MIME_NAMES[i[s++]][i[s]];
}

var a = e => {
    for (var t, i = "", o = "", s = "", a = "", E = (e = e.trim()).length; E-- > 0; ) {
        if ("." === (t = e[E])) o in r && (i = o) || s in r && (i = s) || a in r && (i = a); else if ("/" === t || "\\" === t) break;
        o = t + o, s = t.toUpperCase() + s, a = t.toLowerCase() + a;
    }
    return i;
};

exports.EXTENSIONS = r, exports.ext = a, exports.extname = e => (e = a(e)) && "." + e, 
exports.mime = e => (e = a(e)) ? r[e][0] : e, exports.mimeList = e => (e = a(e)) ? r[e].slice(0) : [];
