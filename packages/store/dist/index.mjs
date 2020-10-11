import { noop, setOwnProp, setOwnProps, isArr, isVoid, isFunc, isPromise, each, inArr } from '@wareset/utilites';
import equal from './equal.mjs';
import { watchableFactory, watchFactory, crossFactory } from './methods.mjs';
const QUEUE = [];
let GLOBAL_EXECUTING;

const validateInputs = v => {
  return Store.isStore(v) || !isArr(v) ? [v] : [...v];
};

class Store extends Array {
  static isStore(v) {
    return v instanceof Store;
  }

  constructor(VALUE, _observed, _depended, start) {
    super();
    if (isFunc(_observed)) start = _observed, _observed = [];
    if (isFunc(_depended)) start = _depended, _depended = [];
    if (!isFunc(start)) start = noop;
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

    const setOwnPropSELF = setOwnProp(SELF);
    const setOwnPropsSELF = setOwnProps(SELF);
    setOwnPropSELF('isStore', isStore);

    const queueStart = () => {
      let sub; // console.log('QUEUE.length', QUEUE.length);

      while (QUEUE.length) {
        if (GLOBAL_EXECUTING) break;
        sub = QUEUE.pop();

        if (!sub.unsubscribed && !sub.executing && sub[0] === QUEUE.length) {
          sub[1](sub[2], sub[3], sub[4], sub.unsubscribe);
        }
      }
    };

    const updateVALUE = (newVALUE, deep, _choice_) => {
      if (!equal(VALUE, newVALUE, deep)) {
        updating = true;
        previousVALUE = VALUE;
        if (!equal(VALUE, newVALUE, 0)) previousDifferingVALUE = VALUE;
        VALUE = newVALUE;

        if ((!_choice_ || _choice_[2]) && dependencies.length) {
          for (let i = dependencies.length; (i -= 2) >= 0; undefined) {
            if (!dependencies[i]._.updating) {
              // prettier-ignore
              dependencies[i]._.updateVALUE(VALUE, dependencies[i + 1], [1, 1, 1]);
            }
          }
        }

        if ((!_choice_ || _choice_[1]) && observables.length) {
          for (let i = observables.length; (i -= 2) >= 0; undefined) {
            if (!observables[i]._.updating && !equal(VALUE, previousVALUE, observables[i + 1])) {
              // prettier-ignore
              observables[i]._.updateVALUE(observables[i]._.VALUE, null, [1]);
            }
          }
        }

        if ((!_choice_ || _choice_[0]) && stop && subscribers.length) {
          const observedVALUES = getObservedVALUES();

          for (let i = subscribers.length; i-- > 0; undefined) {
            if (!subscribers[i].executing) {
              subscribers[i][0] = QUEUE.length;
              subscribers[i][2] = VALUE;
              subscribers[i][3] = observedVALUES;
              QUEUE.push(subscribers[i]);
            }
          }
        }

        if (!_choice_) queueStart();
        updating = false;
      }

      return SELF;
    }; // CREATE STORE
    // STORE METHODS


    setOwnPropSELF('subscribe', (subscribe = noop, autorun = true) => {
      const subscriber = [-1];

      const SUBSCRIBE = (...a) => {
        subscriber.executing = true;
        GLOBAL_EXECUTING = true;
        subscriber.stop = subscribe(...a);
        GLOBAL_EXECUTING = false;
        if (!isPromise(subscriber.stop)) subscriber.executing = false;else subscriber.stop.finally(() => subscriber.executing = false);
        queueStart();
        return subscriber.stop;
      };

      subscriber.push(SUBSCRIBE, VALUE, [], SELF);
      subscribers.push(subscriber);

      const RUN = (cb, unsub) => {
        let res;
        if (!isFunc(unsub)) unsub = noop;
        if (isFunc(cb)) res = cb(VALUE, getObservedVALUES(), SELF, unsub);else if (isPromise(cb)) res = cb.then(cb => RUN(cb, unsub));
        return res || noop;
      };

      let initialized = false;

      const unsubscribe = () => {
        subscriber.unsubscribed = true;
        if (!initialized) initialized = true;else {
          const index = subscribers.indexOf(subscriber);
          if (index !== -1) subscribers.splice(index, 1);
          RUN(subscriber.stop);
          if (!subscribers.length) RUN(stop), stop = null;
        }
        return SELF;
      };

      subscriber.unsubscribe = unsubscribe;
      if (!stop && subscribers.length) stop = RUN(start, unsubscribe);
      if (autorun) subscriber.stop = RUN(SUBSCRIBE, unsubscribe);
      if (initialized) unsubscribe();
      initialized = true;
      return unsubscribe;
    }); // OBSERVABLE
    // prettier-ignore

    const [unobservable, observable] = watchableFactory(SELF, isStore, observables, ['observed', 'unobserve', 'observe', false, [1]]); // OBSERVE
    // prettier-ignore

    const [unobserve, observe] = watchFactory(SELF, isStore, observed, ['observables', 'unobservable', 'observable']); // DEPENDENCY
    // prettier-ignore

    const [undependency, dependency] = watchableFactory(SELF, isStore, dependencies, ['depended', 'undepend', 'depend', true, false]); // DEPEND
    // prettier-ignore

    const [undepend, depend] = watchFactory(SELF, isStore, depended, ['dependencies', 'undependency', 'dependency']); // BRIDGE
    // prettier-ignore

    const [unbridge, bridge] = crossFactory(SELF, isStore, dependency, ['undepend', 'depend']);
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
    const setOwnPropServices = setOwnProp(__service__);
    each({
      isStore,
      updateVALUE
    }, (value, key) => {
      setOwnPropServices(key, {
        get: () => value
      });
    });
    each({
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

    const __update__ = (update, deep) => {
      const newVALUE = update(VALUE, getObservedVALUES(), SELF, noop);
      if (!isPromise(newVALUE)) updateVALUE(newVALUE, deep);else newVALUE.then(value => updateVALUE(value, deep));
      return SELF;
    };

    setOwnPropsSELF({
      update: update => __update__(update, -1),
      updateWeak: (update, deep) => __update__(update, deep || 0),
      updateSure: update => __update__(update, null)
    });
    each({
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
    each({
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

    const clearSubscribers = () => {
      while (subscribers.length) subscribers[0].unsubscribe();

      if (subscribers.length) SELF.clearSubscribers();
    };

    setOwnPropSELF('clearSubscribers', () => {
      clearSubscribers();
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
    setOwnPropSELF('clearBridges', () => {
      [...depended].forEach(v => inArr(dependencies, v) && [undepend(v), undependency(v)]);
      return SELF;
    });
    setOwnPropSELF('clearAll', () => {
      observe([]), observable([]);
      depend([]), dependency([]);
      clearSubscribers();
      return SELF;
    });
    setOwnPropSELF('reset', {
      get: () => SELF.clearAll
    }); // NEXT

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
      setOwnPropSELF(v, (...a) => isVoid(VALUE) || !VALUE[v] ? VALUE : VALUE[v](...a));
    });
    observe(_observed);
    depend(_depended); // Object.seal(SELF);
  }

}

function __Store(...args) {
  return new Store(...args);
}

__Store.Store = Store;
__Store.isStore = Store.isStore;
export default __Store;