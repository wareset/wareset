const listen = require('./lib/listen');
const { CLASSES, TARGETS: TYPES } = require('./lib/constants');

function get_type(types) {
  const arr = types.trim().split(/\s+/g);
  return arr.length === 1 ? arr[0] : arr;
}

function get_fns(...fns) {
  return [].concat(...fns).filter((v) => typeof v === 'function');
}

function unique(v, k, a) {
  return a[k] === v;
}

function check_types(TYPES) {
  Object.keys(TYPES).forEach((t) => !TYPES[t].length && delete TYPES[t]);
  return Object.keys(TYPES).length;
}

class WaresetEventer {
  constructor(target) {
    if (!(target instanceof Element)) throw new Error();
    this.target = target;
    this.init();
  }

  get TYPES() {
    return TYPES.get(this.target) || (TYPES.set(this.target, {}) && this.TYPES);
  }

  add(types, ...args) {
    const type = get_type(types);
    const fns = get_fns(...args);
    if (!fns.length) return this;
    if (Array.isArray(type)) {
      type.forEach((type) => this.add(type, ...fns));
    } else if (type) {
      const TYPES = this.TYPES;
      TYPES[type] = [...(TYPES[type] || []), ...fns].filter(unique);
      if (check_types(TYPES)) this.init();
    }

    return this;
  }

  remove(types, ...args) {
    const type = get_type(types);
    const fns = get_fns(...args);
    if (!fns.length) fns = TYPES[type];
    if (Array.isArray(type)) {
      type.forEach((type) => this.remove(type, ...fns));
    } else if (type in TYPES) {
      const TYPES = this.TYPES;
      TYPES[type] = TYPES[type].filter((fn) => fns.some((fn2) => fn === fn2));
      if (!check_types(TYPES)) this.destroy();
    }

    return this;
  }

  init() {
    if (!CLASSES.has(this.target)) CLASSES.set(this.target, this);
    listen(!!TYPES.size);
    return this;
  }

  destroy() {
    CLASSES.delete(this.target), TYPES.delete(this.target);
    listen(!!TYPES.size);
    return this;
  }
}

function Eventer(target, ...args) {
  return CLASSES.get(target) || new WaresetEventer(target, ...args);
}
Eventer.CLASSES = CLASSES;
Eventer.TYPES = TYPES;

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

module.exports = Eventer;
