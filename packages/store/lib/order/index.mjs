import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { keys } from '@wareset-utilites/object/keys';
var r = [];
var o = [0];

var createOrder = e => (r.push(e = [r.length + 1]), e);

var removeOrder = e => {
  o[0]++, r[e[0] - 1][0] = 0;
};

var normalizeOrderList = s => {
  if (o[0] > 3e3) {
    var i = o[0] = 0;
    r = r.filter(e => !(!e[0] || !(e[0] = ++i)));
    var c = s[0];
    s[0] = {}, forEachLeft(keys(c), e => {
      s[0][c[e][0][0]] = c[e];
    });
  }
};

export { createOrder, normalizeOrderList, removeOrder };
