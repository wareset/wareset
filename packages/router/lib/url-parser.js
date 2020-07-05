const { parse } = require('querystring');

function getHeader(k) {
  if (!this.headers[k]) return '';
  const l = this.headers[k].indexOf(',');
  return l < 0 ? this.headers[k] : this.headers[k].slice(0, l);
}

function urlParser({ queryParser = parse } = {}) {
  return (req, res, next) => {
    const g = getHeader.bind(req);

    const obj = (req._parsedUrl = {});
    obj._raw = req.originalUrl || (req.originalUrl = req.url);
    obj.path = obj._raw;

    obj.protocol =
      req.protocol ||
      (req.protocol =
        g('x-forwarded-proto') ||
        'http' + (req.connection.encrypted ? 's' : ''));

    obj.host =
      req.host ||
      (req.host = g('x-forwarded-host') || g('host') || 'localhost');

    obj.origin = obj.protocol + '://' + obj.host;

    const [hostname, port] = obj.host.split(':');
    obj.hostname = req.hostname || (req.hostname = hostname);
    obj.port = req.port || (req.port = port);

    const [pathname = '', query] = obj._raw.split('?');
    obj.pathname = req.path = req.pathname || (req.pathname = pathname);
    obj.search = req.search || (req.search = query ? '?' + query : query);
    obj.query = req.query = query && queryParser ? queryParser(query) : {};

    if (typeof next === 'function') next();
    return obj;
  };
}

module.exports = urlParser;
