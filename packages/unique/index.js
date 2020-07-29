function filter(v, k, a) {
  for (const val of this) {
    if (v === val) return false;
    if (val instanceof RegExp && val.test('' + v)) return false;
  }
  return a.indexOf(v) === k;
}

function unique(arr, k, a) {
  const fn = filter.bind(this || unique.pattern);
  return a ? fn(arr, k, a) : arr.filter(fn);
}
unique.pattern = ['', null, undefined];

module.exports = unique;
