const listen = require('./lib/listen');
listen(true);

const { getWhich } = require('./lib/util');
const { CLASSES, TARGETS: TRGTS, STYLES } = require('./lib/constants');

function get_type(types) {
  const arr = types.trim().split(/\s+/g);
  return arr; // arr.length === 1 ? arr[0] : arr;
}

function get_fns(...fns) {
  return [].concat(...fns).filter((v) => typeof v === 'function');
}

function unique(v, k, a) {
  return a[k] === v;
}

function check_types(TYPES) {
  Object.keys(TYPES).forEach((type) => {
    Object.keys(TYPES[type]).forEach((which) => {
      if (!TYPES[type][which].length) delete TYPES[type][which];
    });
    if (!Object.keys(TYPES[type]).length) delete TYPES[type];
  });
  return Object.keys(TYPES).length;
}

class WaresetEventer {
  constructor(target) {
    if (!(target instanceof Element)) throw new Error();
    this.target = target;
    STYLES.forEach((v) => (target.style[v[0]] = v[1]));
  }

  get TYPES() {
    return TRGTS.get(this.target) || (TRGTS.set(this.target, {}) && this.TYPES);
  }

  add(types, ...args) {
    const fns = get_fns(...args);
    if (!fns.length) return this;
    const TYPES = this.TYPES;
    get_type(types).forEach((type) => {
      const w = getWhich(type);
      const t = type.replace(/\:(\d+)/, '');
      if (!TYPES[t]) TYPES[t] = {};
      console.log(t, w);
      TYPES[t][w] = [...(TYPES[t][w] || []), ...fns].filter(unique);
    });
    if (check_types(TYPES)) this.init();

    return this;
  }

  remove(types, ...args) {
    const _fns = get_fns(...args);
    const TYPES = this.TYPES;
    get_type(types).forEach((type) => {
      const w = getWhich(type);
      const t = type.replace(/\:(\d+)/, '');
      if (!TYPES[t][w]) return;
      const fns = _fns.length ? _fns : TYPES[t][w];
      TYPES[t][w] = TYPES[t][w].filter((fn) => fns.some((fn2) => fn === fn2));
    });
    if (!check_types(TYPES)) this.destroy();

    return this;
  }

  init() {
    if (!CLASSES.has(this.target)) CLASSES.set(this.target, this);
    return this;
  }

  destroy() {
    CLASSES.delete(this.target), TRGTS.delete(this.target);
    return this;
  }
}

function Eventer(target, ...args) {
  return CLASSES.get(target) || new WaresetEventer(target, ...args);
}
Eventer.CLASSES = CLASSES;
// Eventer.TARGETS = TRGTS;

Eventer.add = function add(target, type, ...fns) {
  return Eventer(target).add(type, ...fns);
};

Eventer.remove = function remove(target, type, ...fns) {
  return Eventer(target).remove(type, ...fns);
};

Eventer.init = function init(target) {
  return Eventer(target).init();
};

Eventer.destroy = function destroy(target) {
  return Eventer(target).destroy();
};

Eventer.on = function enableGlobal() {
  listen(true);
};
Eventer.off = function disableGlobal() {
  listen(false);
};

module.exports = Eventer;
