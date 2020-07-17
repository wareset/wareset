const http = require('http');
const pathToRegexp = require('path-to-regexp');

const {
  method_normalize,
  path_normalize,
  pattern_normalize,
  fix_multi_routes,
  onError,
  check_patterns,
} = require('./lib/util');

const { __fix_req } = require('./lib/req');
const { __fix_res } = require('./lib/res');

const { parse: queryParserDefault } = require('querystring');
const urlParser = require('./lib/url-parser');
const bodyParserDefault = require('body-parser');
const cookieParserDefault = require('cookie-parser');
const corsDefault = require('cors');
const helmetDefault = require('helmet');

let isFunc = (x) => typeof x === 'function';

// const noop = () => {};

class WaresetRouter {
  constructor({
    server = http.createServer(),
    settings: {
      cookieSettings = [],
      corsSettings = [],
      helmetSettings = [{ hidePoweredBy: { setTo: 'PHP 7.4.7' } }],
    } = {},
    parsers: {
      queryParser = queryParserDefault,
      cookieParser = cookieParserDefault(...cookieSettings),
      bodyParser = [
        bodyParserDefault.urlencoded({ extended: true }),
        bodyParserDefault.json(),
        bodyParserDefault.raw(),
      ],
    } = {},
    additional: {
      cors = corsDefault(...corsSettings),
      helmet = helmetDefault(...helmetSettings),
    } = {},
  } = {}) {
    this._ = ['*', '/*'];
    //server
    (this._server = server).on('request', this.onRequest.bind(this));

    // parsers
    this._parsers = [urlParser({ queryParser })]
      .concat(cookieParser, bodyParser, cors, helmet)
      .filter((v) => typeof v === 'function');

    this._routes = [];

    this.use = (...a) => this.route('*', '/*', ...a);
    this.all = (...a) => this.route('*', this._[1], ...a);
    http.METHODS.forEach((v) => {
      const m = v.toLowerCase();
      const M = v.toUpperCase();
      if (!this[m]) this[m] = (...a) => this.route(M, this._[1], ...a);
    });
  }

  route(...a /* methods?, patterns?, fns? */) {
    const fns = [];
    const args = a.filter((v) => {
      if (Array.isArray(v) && isFunc(v[0])) {
        return !fns.push(...v).filter((v) => isFunc(v));
      }
      return isFunc(v) ? !fns.push(v) : true;
    });

    if (!args.length) args.push(this._[0], this._[1]);
    else if (args.length === 1) args.unshift(this._[0]);
    else if (args.length === 3) args.splice(1, 1);
    else if (args.length === 4) args.splice(0, 2);
    else if (args.length > 4) throw new Error('Too many parameters');

    const methods = (this._[0] = method_normalize(args[0]));
    const patterns = (this._[1] = pattern_normalize(args[1]));

    if (fns.length) {
      if (fns.some((v) => v instanceof WaresetRouter)) {
        const FNS = fix_multi_routes(methods, patterns, fns);
        FNS.forEach((v) => this.route(...v));
      } else {
        const parsers = [];
        patterns.forEach((pattern) => {
          let parser;
          if (pattern instanceof RegExp) parser = { regexp: pattern, keys: [] };
          else if (typeof pattern === 'string') {
            const keys = [];
            parser = { regexp: pathToRegexp(pattern, keys), keys };
          } else throw new Error('pattern is not valid: ', pattern);
          parsers.push(parser);
        });

        this._routes.push([methods, parsers, fns, patterns]);
      }
    }

    return this;
  }

  onRequest(req, res) {
    (req.res = res), (res.req = req);
    __fix_res(res), __fix_req(req);
    // this._parsers.forEach((fn) => fn(req, res, noop));


    const method = req.method;
    const path = path_normalize(req.path || req.url.split('?')[0]);

    // console.log(path);

    const routes = [...this._parsers];
    // const routes = [];
    const loop = (() => {
      let i = -1;
      const fn = check_patterns.bind(this);
      return () => fn(++i, method, path) || loop();
    })();

    let i = -1;
    const next = (err) => {
      if (err) return onError(err, req, res, next);
      if (res.finished) return res.finished;
      i++;

      if (!routes[i]) {
        const [params, fns] = loop();
        (req.params = params), routes.push(...fns);
      }

      return routes[i](req, res, next);
    };

    req.next = next;
    next();
  }

  get server() {
    return this._server;
  }

  listen(...args) {
    this._server.listen(...args);
    return this;
  }
}

isFunc = (x) => typeof x === 'function' || x instanceof WaresetRouter;

function router(options) {
  return new WaresetRouter(options);
}

module.exports = router;
