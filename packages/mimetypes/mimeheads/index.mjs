/* eslint-disable */
/*
dester builds:
mimeheads.ts
*/
import { HEADS_DATA } from '../lib/heads';
import { MIME_TYPES, MIME_NAMES } from '../lib/mimes';
/* filename: mimeheads.ts
  timestamp: 2022-05-11T09:37:22.447Z */

var MIME_HEADS = {};

for (var mimeArr, i = HEADS_DATA.length; i--;) {
  for (var j in HEADS_DATA[i]) {
    // @ts-ignore
    mimeArr = HEADS_DATA[i][j = +j]; // @ts-ignore

    MIME_HEADS[MIME_TYPES[i] + '/' + MIME_NAMES[i][j]] = MIME_TYPES[mimeArr[0]] + '/' + MIME_NAMES[mimeArr[0]][mimeArr[1]];
  }
}

var mimeHead = mime => // @ts-ignore
MIME_HEADS[mime] || '';

export { MIME_HEADS, mimeHead };
