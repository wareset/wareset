const http = require('http');

function method_normalize(x) {
  const res = [];
  if (Array.isArray(x)) x.forEach((v) => res.push(...method_normalize(v)));
  else if (typeof x === 'string') {
    res.push(...(x.trim().toUpperCase() || '*').split(/[\s|]+/g));
  } else throw new Error('Method not support: ', x);
  return res
    .map((v) => (v === 'ALL' ? '*' : v))
    .filter(
      (v, k, a) => (v === '*' || ~http.METHODS.indexOf(v)) && a.indexOf(v) === k
    );
}

function path_normalize(x) {
  if (x[0] !== '/') x = '/' + x;
  if (x[x.length - 1] === '/') x = x.slice(0, -1);
  return x;
}

function pattern_normalize(x) {
  const res = [];
  if (Array.isArray(x)) x.forEach((v) => res.push(...pattern_normalize(v)));
  else res.push(x instanceof RegExp ? x : path_normalize(x) || '/*');
  return res;
}

function fix_multi_routes(methods, patterns, fns) {
  const FNS = [];
  let fns2 = [];
  fns.forEach((v) => {
    if (typeof v === 'function') fns2.push(v);
    else {
      if (fns2.length) FNS.push([methods, patterns, ...fns2]);
      fns2 = [];

      v._routes.forEach(([ms2, , fns2, ps2]) => {
        const msNew = method_normalize([methods, ms2]);
        const psNew = [];
        patterns.forEach((p) => ps2.forEach((p2) => psNew.push(p + p2)));
        FNS.push([msNew, pattern_normalize(psNew), ...fns2]);
      });
    }
  });
  if (fns2.length) FNS.push([methods, patterns, ...fns2]);

  return FNS;
}

// https://github.com/lukeed/polka/blob/master/packages/polka/index.js
function onError(err, req, res /*, next*/) {
  const code = (res.statusCode = err.code || err.status || 500);
  if (typeof err === 'string' || Buffer.isBuffer(err)) res.end(err);
  else res.end(err.message || http.STATUS_CODES[code]);
}
const onError404 = onError.bind(null, { code: 404 });

function check_patterns(i, method, path) {
  if (!this._routes[i]) return [null, [onError404]];

  const [methods, parsers, fns] = this._routes[i];

  for (const M of methods) {
    if (M === '*' || M === method) {
      for (const parser of parsers) {
        const matches = parser.regexp.exec(path);
        if (matches) {
          let params;
          if (parser.keys.length) {
            params = {};
            parser.keys.forEach((v, k) => (params[v.name] = matches[k + 1]));
          } else params = { ...matches };
          return [params, fns];
        }
      }

      return false;
    }
  }

  return false;
}

module.exports = {
  method_normalize,
  path_normalize,
  pattern_normalize,
  fix_multi_routes,
  onError,
  check_patterns,
};
