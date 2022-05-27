/* eslint-disable */
/*
dester builds:
mimenotes.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var notes = require('../lib/notes');

var mimes = require('../lib/mimes');
/* filename: mimenotes.ts
  timestamp: 2022-05-11T09:37:23.837Z */


var MIME_NOTES = {};

for (var i = notes.NOTES_DATA.length; i--;) {
  for (var c, j = notes.NOTES_DATA[i].length; j--;) {
    if ((c = notes.NOTES_DATA[i][j]) != null) {
      // @ts-ignore
      MIME_NOTES[mimes.MIME_TYPES[i] + '/' + mimes.MIME_NAMES[i][j]] = notes.NOTES_LIST[c];
    }
  }
}

var mimeNote = mime => // @ts-ignore
MIME_NOTES[mime] || '';

exports.MIME_NOTES = MIME_NOTES;
exports.mimeNote = mimeNote;
