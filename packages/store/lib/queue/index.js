'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var order = require('../order');

var utils = require('../utils');

var o = [{}];
var s = !1;

var launchQueue = () => {
  if (!s) {
    var e, u;
    s = !0;
    var c = {};

    for (; e = o[0][u = utils.getSortedKeys(o[0])[0]];) {
      delete o[0][u], e[2] && e[1].some(e => e[5]) ? c[u] = e : e[5]();
    }

    o[0] = c, order.normalizeOrderList(o), s = !1;
  }
};

var addSubscriberInQueue = e => {
  o[0][e[0][0]] = e, launchQueue();
};

var refreshSubscribersAndWatchers = (r, t) => {
  !r[3][0] || forEachLeft.forEachLeft(r[3], e => {
    o[0][e[0][0]] = e;
  }), !r[9][0] || forEachLeft.forEachLeft(r[9], e => {
    var s = e[0];
    o[0][s[0]] = {
      2: e[2],
      0: s,
      1: e[1],
      5: () => {
        e[15] = t, e[11](() => e[14] ? e[6] : r[7]);
      }
    };
  }), launchQueue();
};

var launchListeners = (e, r, t) => {
  var o,
      s = 0;

  for (; (o = e[8][r][s++]) && o[3](t);) {
    ;
  }
};

exports.addSubscriberInQueue = addSubscriberInQueue;
exports.launchListeners = launchListeners;
exports.launchQueue = launchQueue;
exports.refreshSubscribersAndWatchers = refreshSubscribersAndWatchers;
