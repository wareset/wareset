/* eslint-disable */
/*
dester builds:
mimenotes.ts
*/
import { NOTES_DATA, NOTES_LIST } from '../lib/notes';
import { MIME_TYPES, MIME_NAMES } from '../lib/mimes';
/* filename: mimenotes.ts
  timestamp: 2022-05-11T09:37:23.837Z */

var MIME_NOTES = {};

for (var i = NOTES_DATA.length; i--;) {
  for (var c, j = NOTES_DATA[i].length; j--;) {
    if ((c = NOTES_DATA[i][j]) != null) {
      // @ts-ignore
      MIME_NOTES[MIME_TYPES[i] + '/' + MIME_NAMES[i][j]] = NOTES_LIST[c];
    }
  }
}

var mimeNote = mime => // @ts-ignore
MIME_NOTES[mime] || '';

export { MIME_NOTES, mimeNote };
