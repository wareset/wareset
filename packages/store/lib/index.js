"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilites = require("@wareset/utilites");

var _store = require("./store");

var _equal = _interopRequireDefault(require("./equal"));

var _methods = require("./methods");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const QUEUE = [];

let _lastStore;

const validateInputs = v => {
  return (0, _store.isStore)(v) || !(0, _utilites.isArr)(v) ? [v] : [...v];
};

function __WaresetStore(VALUE, _observed, _depended, start) {
  if ((0, _utilites.isFunc)(_observed)) start = _observed, _observed = [];
  if ((0, _utilites.isFunc)(_depended)) start = _depended, _depended = [];
  if (!(0, _utilites.isFunc)(start)) start = _utilites.noop;
  _observed = validateInputs(_observed);
  _depended = validateInputs(_depended);
  let stop = null;
  let previousVALUE;
  let previousDifferingVALUE;
  let updating = false;
  const subscribers = [];
  const observed = [],
        observables = [];
  const depended = [],
        dependencies = [];

  const getObservedVALUES = () => {
    return observed.map(v => (0, _store.isStore)(v) ? v._.VALUE : v);
  }; // CREATE WRITABLE


  const SELF = new _store.Store();
  const defineSELF = (0, _utilites.define)(SELF);
  let isBreak = false;

  const queueStart = () => {
    if (_lastStore === SELF) {
      let sub; // console.log('QUEUE.length', QUEUE.length);

      while (QUEUE.length) {
        if (isBreak) return;
        sub = QUEUE.pop();

        if (sub.enabled && !sub.executing && sub[0] === QUEUE.length) {
          sub.stop = sub[1](sub[2], sub[3], sub[4], sub.unsubscribe);
        }
      }
    }
  };

  const updateVALUE = (newVALUE, deep, _choice_) => {
    if (!(0, _equal.default)(VALUE, newVALUE, deep)) {
      updating = true;
      previousVALUE = VALUE;
      if (!(0, _equal.default)(VALUE, newVALUE, 0)) previousDifferingVALUE = VALUE;
      VALUE = newVALUE;
      const isLast = _lastStore !== SELF;
      const isOnly = !observables.length && !dependencies.length; // _lastStore = SELF;

      if ((!_choice_ || _choice_[0]) && stop && subscribers.length) {
        const observedVALUES = getObservedVALUES();

        for (let i = subscribers.length; i-- > 0; undefined) {
          if (isLast || !subscribers[i].executing && isOnly) {
            subscribers[i][0] = QUEUE.length;
            subscribers[i][2] = VALUE;
            subscribers[i][3] = observedVALUES;
            QUEUE.push(subscribers[i]);
          }
        }
      }

      _lastStore = SELF;

      if ((!_choice_ || _choice_[2]) && dependencies.length) {
        for (let i = dependencies.length; (i -= 2) >= 0; undefined) {
          if (!dependencies[i]._.updating) {
            dependencies[i]._.updateVALUE(VALUE, dependencies[i + 1]);
          }
        }
      }

      if ((!_choice_ || _choice_[1]) && observables.length) {
        for (let i = observables.length; (i -= 2) >= 0; undefined) {
          if (!observables[i]._.updating && !(0, _equal.default)(VALUE, previousVALUE, observables[i + 1])) {
            observables[i]._.updateVALUE(observables[i]._.VALUE, null, [1]);
          }
        }
      }

      queueStart();
      updating = false;
    }

    return SELF;
  }; // CREATE STORE
  // STORE METHODS


  defineSELF('subscribe', (subscribe = _utilites.noop) => {
    const subscriber = [-1];
    const defineSubscriber = (0, _utilites.define)(subscriber);
    let executing = false;
    defineSubscriber('executing', {
      get: () => executing
    });
    let enabled = true;
    defineSubscriber('enabled', {
      get: () => enabled
    });

    const runSUB = (...a) => {
      isBreak = true;
      executing = true;
      _lastStore = SELF;
      const res = subscribe(...a);
      executing = false;
      isBreak = false, queueStart();
      return res;
    };

    subscriber.push(runSUB, VALUE, [], SELF);
    subscribers.push(subscriber);
    let initialized = false;

    const unsubscribe = () => {
      enabled = false;
      if (!initialized) initialized = true;else {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) subscribers.splice(index, 1);

        if ((0, _utilites.isFunc)(subscriber.stop)) {
          subscriber.stop(VALUE, getObservedVALUES(), SELF, _utilites.noop);
        }

        if (!subscribers.length) {
          if (stop) stop(VALUE, getObservedVALUES(), SELF, _utilites.noop);
          stop = null;
        }
      }
      return SELF;
    };

    subscriber.unsubscribe = unsubscribe;

    if (!stop && subscribers.length) {
      stop = start(VALUE, getObservedVALUES(), SELF, unsubscribe);
      if (!(0, _utilites.isFunc)(stop)) stop = _utilites.noop;
    }

    subscriber.stop = runSUB(VALUE, getObservedVALUES(), SELF, unsubscribe);
    if (initialized) unsubscribe(), console.log(3434, VALUE);
    initialized = true;
    return unsubscribe;
  }); // OBSERVABLE

  const [unobservable, observable] = (0, _methods.watchableFactory)(SELF, observables, ['observed', 'unobserve', 'observe', false, [1]]); // OBSERVE

  const [unobserve, observe] = (0, _methods.watchFactory)(SELF, observed, ['observables', 'unobservable', 'observable']); // DEPENDENCY

  const [undependency, dependency] = (0, _methods.watchableFactory)(SELF, dependencies, ['depended', 'undepend', 'depend', true, false]); // DEPEND

  const [undepend, depend] = (0, _methods.watchFactory)(SELF, depended, ['dependencies', 'undependency', 'dependency']); // BRIDGE

  const [unbridge, bridge] = (0, _methods.crossFactory)(SELF, undepend, depend, dependency, ['undepend', 'depend']);
  const _service_ = {
    get VALUE() {
      return VALUE;
    },

    get previousVALUE() {
      return previousVALUE;
    },

    get previousDifferingVALUE() {
      return previousDifferingVALUE;
    },

    get updating() {
      return updating;
    }

  };
  defineSELF('_', {
    value: _service_
  }, false);
  const defineServices = (0, _utilites.define)(_service_);
  (0, _utilites.forIn)({
    isStore: _store.isStore,
    updateVALUE
  }, (value, key) => {
    defineServices(key, {
      get: () => value
    });
  });
  (0, _utilites.forIn)({
    subscribers,
    observables,
    observed,
    dependencies,
    depended
  }, (value, key) => defineServices(key, {
    get: () => [...value]
  })); // GET

  defineSELF('get', () => VALUE); // SET

  defineSELF('set', newVALUE => updateVALUE(newVALUE, -1));
  defineSELF('setWeak', (newVALUE, deep) => updateVALUE(newVALUE, deep || 0));
  defineSELF('setSure', newVALUE => updateVALUE(newVALUE, null)); // UPDATE

  defineSELF('update', update => updateVALUE(update(VALUE, getObservedVALUES(), SELF, _utilites.noop), -1));
  defineSELF('updateWeak', (update, deep) => updateVALUE(update(VALUE, getObservedVALUES(), SELF, _utilites.noop), deep || 0));
  defineSELF('updateSure', update => updateVALUE(update(VALUE, getObservedVALUES(), SELF, _utilites.noop), null));
  (0, _utilites.forIn)({
    observable,
    observe,
    dependency,
    depend,
    bridge
  }, (value, key) => {
    defineSELF(key, store => value(store, -1));
    defineSELF(`${key}Weak`, (store, deep) => value(store, deep || 0));
    defineSELF(`${key}Sure`, store => value(store, null));
    defineServices(key, {
      get: () => value
    });
  });
  (0, _utilites.forIn)({
    unobservable,
    unobserve,
    undependency,
    undepend,
    unbridge
  }, (value, key) => {
    defineSELF(key, store => value(store));
    defineServices(key, {
      get: () => value
    });
  });
  defineSELF('clear', () => {
    observable([]), observe([]), dependency([]), depend([]);
    return SELF;
  });
  defineSELF('reset', () => {
    SELF.clear();

    while (subscribers.length) subscribers[0].unsubscribe();

    if (subscribers.length) SELF.reset();
    return SELF;
  }); // NEXT

  defineSELF('next', {
    get: () => SELF.set
  }); // GET AND SET VALUEUE

  [0, '$', 'value'].forEach(v => {
    defineSELF(v, {
      enumerable: !v,
      get: () => SELF.get(),
      set: newVALUE => SELF.set(newVALUE)
    });
  }); // TYPE COERCION

  ['valueOf', 'toString', 'toJSON'].forEach(v => {
    defineSELF(v, (...a) => (0, _utilites.isVoid)(VALUE) || !VALUE[v] ? VALUE : VALUE[v](...a));
  });
  observe(_observed);
  depend(_depended);
  return SELF;
}

__WaresetStore.isStore = _store.isStore;
var _default = __WaresetStore;
exports.default = _default;