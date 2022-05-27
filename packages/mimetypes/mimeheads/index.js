/* eslint-disable */
/*
dester builds:
mimeheads.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var heads = require('../lib/heads');

var mimes = require('../lib/mimes');
/* filename: mimeheads.ts
  timestamp: 2022-05-11T09:37:22.447Z */


var MIME_HEADS = {};

for (var mimeArr, i = heads.HEADS_DATA.length; i--;) {
  for (var j in heads.HEADS_DATA[i]) {
    // @ts-ignore
    mimeArr = heads.HEADS_DATA[i][j = +j]; // @ts-ignore

    MIME_HEADS[mimes.MIME_TYPES[i] + '/' + mimes.MIME_NAMES[i][j]] = mimes.MIME_TYPES[mimeArr[0]] + '/' + mimes.MIME_NAMES[mimeArr[0]][mimeArr[1]];
  }
}

var mimeHead = mime => // @ts-ignore
MIME_HEADS[mime] || '';

exports.MIME_HEADS = MIME_HEADS;
exports.mimeHead = mimeHead;
