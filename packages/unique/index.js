function _filter(v, k, a) {
  for (const val of this) {
    if (v === val) return false;
    if (val instanceof RegExp && val.test('' + v)) return false;
  }
  return a.indexOf(v) === k;
}

function unique(arr, k, a) {
  const fn = _filter.bind(this || ['', null, undefined]);
  return a ? fn(arr, k, a) : arr.filter(fn);
}

module.exports = unique;
