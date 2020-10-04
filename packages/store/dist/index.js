"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _utilites() {
  const data = require("@wareset/utilites");

  _utilites = function () {
    return data;
  };

  return data;
}

var _equal = _interopRequireDefault(require("./equal.js"));

var _methods = require("./methods.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const QUEUE = [];

let _lastStore;

const validateInputs = v => {
  return Store.isStore(v) || !(0, _utilites().isArr)(v) ? [v] : [...v];
};

class Store extends Array {
  static isStore(v) {
    return v instanceof Store;
  }

  constructor(VALUE, _observed, _depended, start) {
    super();
    if ((0, _utilites().isFunc)(_observed)) start = _observed, _observed = [];
    if ((0, _utilites().isFunc)(_depended)) start = _depended, _depended = [];
    if (!(0, _utilites().isFunc)(start)) start = _utilites().noop;
    _observed = validateInputs(_observed);
    _depended = validateInputs(_depended);
    const isStore = Store.isStore;
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
      return observed.map(v => isStore(v) ? v._.VALUE : v);
    }; // CREATE WRITABLE


    const SELF = this; // new Store();

    const setOwnPropSELF = (0, _utilites().setOwnProp)(SELF);
    const setOwnPropsSELF = (0, _utilites().setOwnProps)(SELF);
    setOwnPropSELF('isStore', isStore);
    let isBreak = false;

    const queueStart = () => {
      if (_lastStore === SELF) {
        let sub; // console.log('QUEUE.length', QUEUE.length);

        while (QUEUE.length) {
          if (isBreak) break;
          sub = QUEUE.pop();

          if (sub.enabled && !sub.executing && sub[0] === QUEUE.length) {
            sub[1](sub[2], sub[3], sub[4], sub.unsubscribe);
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

        _lastStore = SELF;

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


    setOwnPropSELF('subscribe', (subscribe = _utilites().noop) => {
      const subscriber = [-1];
      const setOwnPropSubscriber = (0, _utilites().setOwnProp)(subscriber);
      let executing = false;
      setOwnPropSubscriber('executing', {
        get: () => executing
      });
      let enabled = true;
      setOwnPropSubscriber('enabled', {
        get: () => enabled
      });

      const runSubscribe = (...a) => {
        isBreak = true, executing = true;
        _lastStore = SELF;
        subscriber.stop = subscribe(...a);
        executing = false, isBreak = false, queueStart();
        return subscriber.stop;
      };

      subscriber.push(runSubscribe, VALUE, [], SELF);
      subscribers.push(subscriber);

      const runCallback = (cb, unsub) => {
        if (!(0, _utilites().isFunc)(unsub)) unsub = _utilites().noop;
        if ((0, _utilites().isFunc)(cb)) return cb(VALUE, getObservedVALUES(), SELF, unsub);else if ((0, _utilites().isPromise)(cb)) return cb.then(cb => runCallback(cb, unsub));
      };

      let initialized = false;

      const unsubscribe = () => {
        enabled = false;
        if (!initialized) initialized = true;else {
          const index = subscribers.indexOf(subscriber);
          if (index !== -1) subscribers.splice(index, 1);
          runCallback(subscriber.stop);
          if (!subscribers.length) runCallback(stop), stop = null;
        }
        return SELF;
      };

      subscriber.unsubscribe = unsubscribe;
      if (!stop && subscribers.length) stop = runCallback(start, unsubscribe);
      subscriber.stop = runCallback(runSubscribe, unsubscribe);
      if (initialized) unsubscribe();
      initialized = true;
      return unsubscribe;
    }); // OBSERVABLE

    const [unobservable, observable] = (0, _methods.watchableFactory)(SELF, observables, ['observed', 'unobserve', 'observe', false, [1]]); // OBSERVE

    const [unobserve, observe] = (0, _methods.watchFactory)(SELF, observed, ['observables', 'unobservable', 'observable']); // DEPENDENCY

    const [undependency, dependency] = (0, _methods.watchableFactory)(SELF, dependencies, ['depended', 'undepend', 'depend', true, false]); // DEPEND

    const [undepend, depend] = (0, _methods.watchFactory)(SELF, depended, ['dependencies', 'undependency', 'dependency']); // BRIDGE

    const [unbridge, bridge] = (0, _methods.crossFactory)(SELF, undepend, depend, dependency, ['undepend', 'depend']);
    const __service__ = {
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
    setOwnPropSELF('_', {
      value: __service__
    }, false);
    const setOwnPropServices = (0, _utilites().setOwnProp)(__service__);
    (0, _utilites().each)({
      isStore,
      updateVALUE
    }, (value, key) => {
      setOwnPropServices(key, {
        get: () => value
      });
    });
    (0, _utilites().each)({
      subscribers,
      observables,
      observed,
      dependencies,
      depended
    }, (value, key) => setOwnPropServices(key, {
      get: () => [...value]
    })); // GET

    const __get__ = () => VALUE;

    setOwnPropSELF('get', () => __get__()); // SET

    const __set__ = (newVALUE, deep) => updateVALUE(newVALUE, deep);

    setOwnPropsSELF({
      set: newVALUE => __set__(newVALUE, -1),
      setWeak: (newVALUE, deep) => __set__(newVALUE, deep || 0),
      setSure: newVALUE => __set__(newVALUE, null)
    }); // UPDATE

    const __update__ = (update, deep) => updateVALUE(update(VALUE, getObservedVALUES(), SELF, _utilites().noop), deep);

    setOwnPropsSELF({
      update: update => __update__(update, -1),
      updateWeak: (update, deep) => __update__(update, deep || 0),
      updateSure: update => __update__(update, null)
    });
    (0, _utilites().each)({
      observable,
      observe,
      dependency,
      depend,
      bridge
    }, (value, key) => {
      setOwnPropsSELF({
        [key]: store => value(store, -1),
        [`${key}Weak`]: (store, deep) => value(store, deep || 0),
        [`${key}Sure`]: store => value(store, null)
      });
      setOwnPropServices(key, {
        get: () => value
      });
    });
    (0, _utilites().each)({
      unobservable,
      unobserve,
      undependency,
      undepend,
      unbridge
    }, (value, key) => {
      setOwnPropSELF(key, store => value(store));
      setOwnPropServices(key, {
        get: () => value
      });
    });
    setOwnPropSELF('clearSubscribers', () => {
      while (subscribers.length) subscribers[0].unsubscribe();

      if (subscribers.length) SELF.clearSubscribers();
      return SELF;
    });
    setOwnPropSELF('clearObserved', () => {
      observe([]);
      return SELF;
    });
    setOwnPropSELF('clearObservables', () => {
      observable([]);
      return SELF;
    });
    setOwnPropSELF('clearDepended', () => {
      depend([]);
      return SELF;
    });
    setOwnPropSELF('clearDependencies', () => {
      dependency([]);
      return SELF;
    });
    setOwnPropSELF('clearAll', () => {
      SELF.clearSubscribers();
      SELF.clearDepended(), SELF.clearDependencies();
      SELF.clearObserved(), SELF.clearObservables();
      return SELF;
    });
    setOwnPropSELF('reset', SELF.clearAll); // NEXT

    setOwnPropSELF('next', {
      get: () => SELF.set
    }); // GET AND SET VALUEUE

    [0, '$', 'value'].forEach(v => {
      setOwnPropSELF(v, {
        enumerable: !v,
        get: () => SELF.get(),
        set: newVALUE => SELF.set(newVALUE)
      });
    }); // TYPE COERCION

    ['valueOf', 'toString', 'toJSON'].forEach(v => {
      setOwnPropSELF(v, (...a) => (0, _utilites().isVoid)(VALUE) || !VALUE[v] ? VALUE : VALUE[v](...a));
    });
    observe(_observed);
    depend(_depended);
    Object.seal(SELF);
  }

}

function __Store(...args) {
  return new Store(...args);
}

__Store.Store = Store;
__Store.isStore = Store.isStore;
var _default = __Store;
exports.default = _default;