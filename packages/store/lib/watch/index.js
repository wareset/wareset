'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var findIndexRight = require('@wareset-utilites/array/findIndexRight');

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var spliceWith = require('@wareset-utilites/array/spliceWith');

var values = require('@wareset-utilites/object/values');

var last = require('@wareset-utilites/array/last');

var queue = require('../queue');

var i = [];

var launchAutoWatch = t => {
  !t[4] && i[0] && i[0][0] !== t && (last.last(i)[1][t[0][0]] = t);
};

var createAutoWatch = t => {
  i.push([t, {}]);
};

var addWatcher = (t, e) => {
  e[9].push(t), queue.launchListeners(e, 1, [t[10]]);
};

var removeWatcher = (t, e) => {
  spliceWith.spliceWith(e[9], t, 1), queue.launchListeners(e, 1, [t[10]]);
};

var updateAutoWatch = r => {
  var a = findIndexRight.findIndexRight(i, t => t[0] === r),
      s = r[1],
      c = i.splice(a, 1)[0][1],
      p = [];
  forEachLeft.forEachLeft(s, t => {
    var e = t[0][0];
    e in c ? (delete c[e], p.push(t)) : removeWatcher(r, t);
  }), p.push(...values.values(c).map(t => (addWatcher(r, t), t))), r[1] = p;
};

exports.addWatcher = addWatcher;
exports.createAutoWatch = createAutoWatch;
exports.launchAutoWatch = launchAutoWatch;
exports.removeWatcher = removeWatcher;
exports.updateAutoWatch = updateAutoWatch;
