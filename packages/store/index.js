const { IS_STORE, DEFAULT_WEAK_SURE } = require('./lib/consts');
const { noop, isVoid, thisIsStore, _define } = require('./lib');
const equal = require('./lib/equal');

const isNotValidParams = v => {
  return thisIsStore(v) || !Array.isArray(v);
};

const QUEUE = [];
let _lastStore;

const inArr = (arr, v, k = 0) => arr.indexOf(v, k) !== -1;

const _normalized_type = (v, type) => {
  return `${v}${inArr(DEFAULT_WEAK_SURE, type, 1) ? type : ''}`;
};

module.exports = function WaresetStore(
  VAL,
  _observed = [],
  _depended = [],
  start = noop
) {
  if (typeof _observed === 'function') (start = _observed), (_observed = []);
  if (typeof _depended === 'function') (start = _depended), (_depended = []);

  _observed = isNotValidParams(_observed) ? [_observed] : [..._observed];
  _depended = isNotValidParams(_depended) ? [_depended] : [..._depended];

  let stop = null;
  let previousVAL;
  let updating = false;

  const subscribers = [];

  const observed = [],
    observables = [];
  const depended = [],
    dependencies = [];

  let last_observed_values = [];
  const _get_last_observed_values = () => {
    last_observed_values = observed.map(v => (thisIsStore(v) ? v.$ : v));
    return last_observed_values;
  };

  // CREATE WRITABLE
  const Writable = [];
  const define = _define(Writable);

  let isBreak = false;
  const queueStart = () => {
    if (_lastStore === Writable) {
      let sub;
      while (QUEUE.length) {
        if (isBreak) break;
        sub = QUEUE.pop();
        if (sub[4] === QUEUE.length) {
          sub[0](sub[1], sub[2], sub[3], sub[4]);
        }
      }
    }
  };

  const updateVAL = (newVAL, deep = null, __choice__ = false) => {
    // if (QUEUE.length > 1000) {
    //   throw new Error(`@wareset/store - QUEUE > 1000 - ${QUEUE.length}`);
    // }

    const is_equal = equal(VAL, newVAL, deep);
    if (!equal(VAL, newVAL, 0)) previousVAL = VAL;
    VAL = newVAL;

    if (is_equal) return Writable;

    updating = true;

    if ((!__choice__ || __choice__[2]) && dependencies.length) {
      for (let i = dependencies.length; (i -= 2) >= 0; undefined) {
        if (!dependencies[i]._.updating) {
          dependencies[i].set[dependencies[i + 1]](VAL);
        }
      }
    }

    _lastStore = Writable;

    if ((!__choice__ || __choice__[0]) && stop && subscribers.length) {
      _get_last_observed_values();
      for (let i = subscribers.length; i-- > 0; undefined) {
        (subscribers[i][1] = VAL), (subscribers[i][2] = last_observed_values);
        (subscribers[i][4] = QUEUE.length), QUEUE.push(subscribers[i]);
      }
    }

    if ((!__choice__ || __choice__[1]) && observables.length) {
      for (let i = observables.length; (i -= 1) >= 0; undefined) {
        if (!observables[i]._.updating) {
          observables[i]._.updateVAL(observables[i].$, null, [1]);
        }
      }
    }

    updating = false;

    queueStart();

    return Writable;
  };

  // CREATE STORE
  // STORE METHODS
  define('subscribe', {
    value: (_subscribe = noop) => {
      const subscribe = (...a) => {
        isBreak = true;
        // _lastStore = Writable;
        const res = _subscribe(...a);
        (isBreak = false), queueStart();
        return res;
      };

      const subscriber = [subscribe, Writable.get, _get_last_observed_values];
      subscribers.push(subscriber);

      if (!stop && subscribers.length) {
        stop = start(Writable.set, _get_last_observed_values()) || noop;
      }
      subscribe(VAL, _get_last_observed_values(), Writable);

      const unsubscribe = () => {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) subscribers.splice(index, 1);
        if (!subscribers.length) stop && stop(), (stop = null);
      };

      subscriber.push(unsubscribe, 0);
      return unsubscribe;
    }
  }, 1);

  // SET AND UPDATE
  const set = newVAL => {
    return updateVAL(newVAL, -1) || Writable;
  };
  const setWeak = (newVAL, deep = 0) => {
    return updateVAL(newVAL, deep) || Writable;
  };
  const setSure = newVAL => {
    return updateVAL(newVAL, null) || Writable;
  };
  set.default = (...a) => Writable.set(...a);
  set.Weak = (...a) => Writable.setWeak(...a);
  set.Sure = (...a) => Writable.setSure(...a);

  define('set', { value: set }, 1);
  define('setWeak', { value: setWeak }, 1);
  define('setSure', { value: setSure }, 1);

  const update = update => set(update(VAL));
  const updateWeak = (update, deep = 2) => setWeak(update(VAL), deep);
  const updateSure = update => setSure(update(VAL));

  update.default = (...a) => Writable.update(...a);
  update.Weak = (...a) => Writable.updateWeak(...a);
  update.Sure = (...a) => Writable.updateSure(...a);

  define('update', { value: update }, 1);
  define('updateWeak', { value: updateWeak }, 1);
  define('updateSure', { value: updateSure }, 1);

  const observable = store => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        Writable.unobservable(store), observables.push(store);
        if (!inArr(store._.observed, Writable)) store.observe(Writable);
        store._.updateVAL(store.$, null, [1]);
      }
    } else if (Array.isArray(store)) {
      Writable.unobservable(Writable._.observables);
      store.forEach(v => Writable.observable(v));
    }
    return Writable;
  };
  define('observable', { value: observable }, 1);

  const observe = store => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        Writable.unobserve(store), observed.push(store);
        if (!inArr(store._.observables, Writable)) store.observable(Writable);
      }
    } else if (Array.isArray(store)) {
      Writable.unobserve(Writable._.observed);
      store.forEach(v => Writable.observe(v));
    }
    return Writable;
  };
  define('observe', { value: observe }, 1);

  // WATCH
  const dependency = (store, type = DEFAULT_WEAK_SURE[0]) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        Writable.undependency(store), dependencies.push(store, type);
        if (!inArr(store._.depended, Writable)) store.depend(Writable);
        store[_normalized_type('set', type)](VAL);
      }
    } else if (Array.isArray(store)) {
      Writable.undependency(Writable._.dependencies);
      store.forEach(v => Writable.dependency(v, type));
    }
    return Writable;
  };

  const depend = (store, type = DEFAULT_WEAK_SURE[0]) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        Writable.undepend(store), depended.push(store);
        if (!inArr(store._.dependencies, Writable)) {
          store[_normalized_type('dependency', type)](Writable);
        }
      }
    } else if (Array.isArray(store)) {
      Writable.undepend(Writable._.depended);
      store.forEach(v => Writable.depend(v, type));
    }
    return Writable;
  };

  const bridge = (store, type = DEFAULT_WEAK_SURE[0]) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        Writable.unbridge(store);
        Writable[_normalized_type('depend', type)](store);
        store[_normalized_type('depend', type)](Writable);
      }
    } else if (Array.isArray(store)) {
      Writable.dependency([]), Writable.depend([]);
      store.forEach(v => Writable.bridge(v, type));
    }
    return Writable;
  };

  const methods = { dependency, depend, bridge };
  Object.keys(methods).forEach(method => {
    DEFAULT_WEAK_SURE.forEach((v, k) => {
      if (!k) methods[method].default = methods[method];
      else methods[method][v] = store => methods[method](store, v);

      define(`${method}${k ? v : ''}`, { value: methods[method][v] }, 1);
    });
  });

  define('unobservable', {
    value: store => {
      if (thisIsStore(store)) {
        const index = observables.indexOf(store);
        if (index !== -1) {
          observables.slice(index, 1);
          if (inArr(store._.observed, Writable)) store.unobserve(Writable);
        }
      } else if (Array.isArray(store)) {
        store.forEach(v => Writable.unobservable(v));
      }
      return Writable;
    }
  }, 1);

  define('unobserve', {
    value: store => {
      if (thisIsStore(store)) {
        const index = observed.indexOf(store);
        if (index !== -1) {
          observed.splice(index, 1);
          if (inArr(store._.observables, Writable)) {
            store.unobservable(Writable);
          }
        }
      } else if (Array.isArray(store)) {
        store.forEach(v => Writable.unobserve(v));
      }
      return Writable;
    }
  }, 1);

  define('undependency', {
    value: store => {
      if (thisIsStore(store)) {
        const index = dependencies.indexOf(store);
        if (index !== -1) {
          dependencies.slice(index, 2);
          if (inArr(store._.depended, Writable)) store.undepend(Writable);
        }
      } else if (Array.isArray(store)) {
        store.forEach(v => Writable.undependency(v));
      }
      return Writable;
    }
  }, 1);

  define('undepend', {
    value: store => {
      if (thisIsStore(store)) {
        const index = depended.indexOf(store);
        if (index !== -1) {
          depended.splice(index, 1);
          if (inArr(store._.dependencies, Writable)) {
            store.undependency(Writable);
          }
        }
      } else if (Array.isArray(store)) {
        store.forEach(v => Writable.undepend(v));
      }
      return Writable;
    }
  }, 1);

  define('unbridge', {
    value: store => {
      if (thisIsStore(store)) {
        store.undepend(Writable), Writable.undepend(store);
      } else if (Array.isArray(store)) {
        store.forEach(v => Writable.unbridge(v));
      }
      return Writable;
    }
  }, 1);

  // GET VALUE
  define('next', { get: () => Writable.set });
  define('get', { writable: true, value: () => VAL });

  define('_', {
    value: {
      get [IS_STORE]() {
        return thisIsStore;
      },

      get depended() {
        return [...depended];
      },
      get dependencies() {
        return [...dependencies];
      },
      get observed() {
        return [...observed];
      },
      get observables() {
        return [...observables];
      },

      get subscribers() {
        return [...subscribers];
      },

      get updating() {
        return updating;
      },

      get previousVAL() {
        return previousVAL;
      },

      get updateVAL() {
        return updateVAL;
      }
    }
  }, 0);

  define('reset', {
    value: () => {
      Writable.observable([]), Writable.observe([]);
      Writable.dependency([]), Writable.depend([]);
      return Writable;
    }
  }, 1);

  // GET VALUE AND SET NEW VALUE
  [0, '$', 'value'].forEach(v => {
    define(v, {
      enumerable: !v,
      get: () => Writable.get(),
      set: newVAL => Writable.set(newVAL)
    });
  });

  // TYPE COERCION
  ['valueOf', 'toString', 'toJSON'].forEach(v => {
    define(v, {
      value: (...a) => (isVoid(VAL) || !VAL[v] ? VAL : VAL[v](...a))
    }, 1);
  });

  Writable.observe(_observed);
  Writable.depend(_depended);

  return Writable;
};
