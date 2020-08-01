function _filter(v, k, a) {
  for (const val of this) {
    if (v === val) return false;
    if (val instanceof RegExp && val.test('' + v)) return false;
  }
  return a.indexOf(v) === k;
}

const DEFAULT_PATTERN = ['', null, undefined];

function unique(arr, k, a) {
  const fn = _filter.bind(this || DEFAULT_PATTERN);
  return a ? fn(arr, k, a) : arr.filter(fn);
}

module.exports = unique;
