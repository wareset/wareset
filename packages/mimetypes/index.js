/* eslint-disable */
/*
dester builds:
index.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var mimes = require('./lib/mimes');
/* filename: index.ts
  timestamp: 2022-05-11T09:47:49.430Z */
// export const EXTNAMES = {} as Readonly<{ [K in keyof typeof EXTENSIONS]?: string[] }>
// export const EXTNAMES = {} as Readonly<Record<keyof typeof EXTENSIONS, string[]>>


var EXTENSIONS = {};

for (var _ext in mimes.EXTENSIONS) {
  // @ts-ignore
  EXTENSIONS[_ext] = []; // @ts-ignore

  for (var a = mimes.EXTENSIONS[_ext], j = 0, i = 0; i < a.length; i++) {
    // @ts-ignore
    EXTENSIONS[_ext][j++] = mimes.MIME_TYPES[a[i]] + '/' + mimes.MIME_NAMES[a[i++]][a[i]];
  }
} // @ts-ignore


var MIMES = {};

for (var _i = mimes.MIME_TYPES.length; _i-- > 0;) {
  MIMES[mimes.MIME_TYPES[_i]] = {};

  for (var _j = mimes.MIME_NAMES[_i].length; _j-- > 0;) {
    MIMES[mimes.MIME_TYPES[_i]][mimes.MIME_NAMES[_i][_j]] = true;
  }
}

var ext = file => {
  file = file.trim();
  var ext = '';

  for (var c, s = '', su = '', sl = '', _i2 = file.length; _i2-- > 0;) {
    if ((c = file[_i2]) === '.') {
      s in EXTENSIONS && (ext = s) || su in EXTENSIONS && (ext = su) || sl in EXTENSIONS && (ext = sl);
    } else if (c === '/' || c === '\\') break;

    s = c + s, su = c.toUpperCase() + su, sl = c.toLowerCase() + sl;
  }

  return ext;
};

var extname = filepath => (filepath = ext(filepath)) && '.' + filepath;

var mime = filepath => // @ts-ignore
(filepath = ext(filepath)) ? EXTENSIONS[filepath][0] : filepath;

var mimeList = filepath => // @ts-ignore
(filepath = ext(filepath)) ? EXTENSIONS[filepath].slice(0) : [];

exports.EXTENSIONS = EXTENSIONS;
exports.MIME_TYPES = MIMES;
exports.ext = ext;
exports.extname = extname;
exports.mime = mime;
exports.mimeList = mimeList;
