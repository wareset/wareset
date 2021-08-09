import { findIndexRight } from '@wareset-utilites/array/findIndexRight';
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { spliceWith } from '@wareset-utilites/array/spliceWith';
import { values } from '@wareset-utilites/object/values';
import { last } from '@wareset-utilites/array/last';
import { launchListeners } from '../queue';
var i = [];

var launchAutoWatch = t => {
  !t[4] && i[0] && i[0][0] !== t && (last(i)[1][t[0][0]] = t);
};

var createAutoWatch = t => {
  i.push([t, {}]);
};

var addWatcher = (t, e) => {
  e[9].push(t), launchListeners(e, 1, [t[10]]);
};

var removeWatcher = (t, e) => {
  spliceWith(e[9], t, 1), launchListeners(e, 1, [t[10]]);
};

var updateAutoWatch = r => {
  var a = findIndexRight(i, t => t[0] === r),
      s = r[1],
      c = i.splice(a, 1)[0][1],
      p = [];
  forEachLeft(s, t => {
    var e = t[0][0];
    e in c ? (delete c[e], p.push(t)) : removeWatcher(r, t);
  }), p.push(...values(c).map(t => (addWatcher(r, t), t))), r[1] = p;
};

export { addWatcher, createAutoWatch, launchAutoWatch, removeWatcher, updateAutoWatch };
