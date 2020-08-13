function _global() {
  return this;
}
const global = _global();

function _filter(v, k, a) {
  for (const val of this) {
    if (v === val) return false;
    if (val instanceof RegExp && val.test('' + v)) return false;
  }
  return a.indexOf(v) === k;
}

const DEFAULT_PATTERN = ['', null, undefined];

function unique(arr, k, a) {
  const self =
    !this || !Array.isArray(this) || this === global ? DEFAULT_PATTERN : this;
  const fn = _filter.bind(self);
  return a ? fn(arr, k, a) : arr.filter(fn);
}

module.exports = unique;
