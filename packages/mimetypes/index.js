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

var E = e => {
    for (var t, i = "", o = "", s = (e = e.trim()).length; s-- > 0; ) {
        if ("." === (t = e[s])) o in r && (i = o); else if ("/" === t || "\\" === t) break;
        o = t + o;
    }
    return i;
};

exports.EXTENSIONS = r, exports.ext = E, exports.extname = e => (e = E(e)) && "." + e, 
exports.mime = e => (e = E(e)) ? r[e][0] : e, exports.mimeList = e => (e = E(e)) ? r[e].slice(0) : [];
