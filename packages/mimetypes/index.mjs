/* eslint-disable */
/*
dester builds:
index.ts
*/
import { EXTENSIONS as EXTENSIONS$1, MIME_TYPES, MIME_NAMES } from './lib/mimes';
/* filename: index.ts
  timestamp: 2022-05-11T09:47:49.430Z */
// export const EXTNAMES = {} as Readonly<{ [K in keyof typeof EXTENSIONS]?: string[] }>
// export const EXTNAMES = {} as Readonly<Record<keyof typeof EXTENSIONS, string[]>>

var EXTENSIONS = {};

for (var _ext in EXTENSIONS$1) {
  // @ts-ignore
  EXTENSIONS[_ext] = []; // @ts-ignore

  for (var a = EXTENSIONS$1[_ext], j = 0, i = 0; i < a.length; i++) {
    // @ts-ignore
    EXTENSIONS[_ext][j++] = MIME_TYPES[a[i]] + '/' + MIME_NAMES[a[i++]][a[i]];
  }
} // @ts-ignore


var MIMES = {};

for (var _i = MIME_TYPES.length; _i-- > 0;) {
  MIMES[MIME_TYPES[_i]] = {};

  for (var _j = MIME_NAMES[_i].length; _j-- > 0;) {
    MIMES[MIME_TYPES[_i]][MIME_NAMES[_i][_j]] = true;
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

export { EXTENSIONS, MIMES as MIME_TYPES, ext, extname, mime, mimeList };
