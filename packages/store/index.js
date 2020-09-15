const { IS_STORE } = require('./lib/consts');
const { noop, isVoid, thisIsStore, _define, inArr } = require('./lib');
const equal = require('./lib/equal');

const QUEUE = [];
let _lastStore;

const _is_not_valid_params = v => {
  return thisIsStore(v) || !Array.isArray(v);
};

module.exports = function WaresetStore(
  VAL,
  _observed = [],
  _depended = [],
  start = noop
) {
  if (typeof _observed === 'function') (start = _observed), (_observed = []);
  if (typeof _depended === 'function') (start = _depended), (_depended = []);

  _observed = _is_not_valid_params(_observed) ? [_observed] : [..._observed];
  _depended = _is_not_valid_params(_depended) ? [_depended] : [..._depended];

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

  const updateVAL = (newVAL, deep = null, _choice_ = false) => {
    const is_equal = equal(VAL, newVAL, deep);
    if (!equal(VAL, newVAL, 0)) previousVAL = VAL;
    VAL = newVAL;

    if (!is_equal) {
      updating = true;

      if ((!_choice_ || _choice_[2]) && dependencies.length) {
        for (let i = dependencies.length; (i -= 2) >= 0; undefined) {
          if (!dependencies[i]._.updating) {
            dependencies[i]._.updateVAL(VAL, dependencies[i + 1]);
          }
        }
      }

      _lastStore = Writable;

      if ((!_choice_ || _choice_[0]) && stop && subscribers.length) {
        _get_last_observed_values();
        for (let i = subscribers.length; i-- > 0; undefined) {
          (subscribers[i][1] = VAL), (subscribers[i][2] = last_observed_values);
          (subscribers[i][4] = QUEUE.length), QUEUE.push(subscribers[i]);
        }
      }

      if ((!_choice_ || _choice_[1]) && observables.length) {
        for (let i = observables.length; (i -= 1) >= 0; undefined) {
          if (!observables[i]._.updating) {
            observables[i]._.updateVAL(observables[i].$, null, [1]);
          }
        }
      }

      updating = false;

      queueStart();
    }

    return Writable;
  };

  // const self = {
  //   Writable,
  //   observables
  // };

  // OBSERVABLE
  const unobservable = store => {
    if (thisIsStore(store)) {
      const index = observables.indexOf(store);
      if (index !== -1) {
        observables.slice(index, 1);
        if (inArr(store._.observed, Writable)) store._.unobserve(Writable);
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => unobservable(v));
    }
    return Writable;
  };
  const observable = store => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        unobservable(store), observables.push(store);
        if (!inArr(store._.observed, Writable)) store._.observe(Writable);
        store._.updateVAL(store.$, null, [1]);
      }
    } else if (Array.isArray(store)) {
      unobservable(observables);
      store.forEach(v => observable(v));
    }
    return Writable;
  };

  // OBSERVE
  const unobserve = store => {
    if (thisIsStore(store)) {
      const index = observed.indexOf(store);
      if (index !== -1) {
        observed.splice(index, 1);
        if (inArr(store._.observables, Writable)) {
          store._.unobservable(Writable);
        }
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => unobserve(v));
    }
    return Writable;
  };
  const observe = store => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        unobserve(store), observed.push(store);
        if (!inArr(store._.observables, Writable)) store._.observable(Writable);
      }
    } else if (Array.isArray(store)) {
      unobserve(observed);
      store.forEach(v => observe(v));
    }
    return Writable;
  };

  // DEPENDENCY
  const undependency = store => {
    if (thisIsStore(store)) {
      const index = dependencies.indexOf(store);
      if (index !== -1) {
        dependencies.slice(index, 2);
        if (inArr(store._.depended, Writable)) store._.undepend(Writable);
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => undependency(v));
    }
    return Writable;
  };
  const dependency = (store, deep = -1) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        undependency(store), dependencies.push(store, deep);
        if (!inArr(store._.depended, Writable)) store._.depend(Writable);
        store._.updateVAL(VAL, deep);
      }
    } else if (Array.isArray(store)) {
      undependency(dependencies);
      store.forEach(v => dependency(v, deep));
    }
    return Writable;
  };

  // DEPEND
  const undepend = store => {
    if (thisIsStore(store)) {
      const index = depended.indexOf(store);
      if (index !== -1) {
        depended.splice(index, 1);
        if (inArr(store._.dependencies, Writable)) {
          store._.undependency(Writable);
        }
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => undepend(v));
    }
    return Writable;
  };
  const depend = (store, deep = -1) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        undepend(store), depended.push(store);
        if (!inArr(store._.dependencies, Writable)) {
          store._.dependency(Writable, deep);
        }
      }
    } else if (Array.isArray(store)) {
      undepend(depended);
      store.forEach(v => depend(v, deep));
    }
    return Writable;
  };

  // BRIDGE
  const unbridge = store => {
    if (thisIsStore(store)) {
      store._.undepend(Writable), undepend(store);
    } else if (Array.isArray(store)) {
      store.forEach(v => unbridge(v));
    }
    return Writable;
  };
  const bridge = (store, deep = -1) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        unbridge(store);
        depend(store, deep);
        store.dependWeak(Writable, deep);
      }
    } else if (Array.isArray(store)) {
      dependency([]), depend([]);
      store.forEach(v => bridge(v, deep));
    }
    return Writable;
  };

  define('_', {
    value: {
      get [IS_STORE]() {
        return thisIsStore;
      },

      get updating() {
        return updating;
      },

      get previousVAL() {
        return previousVAL;
      },

      get subscribers() {
        return [...subscribers];
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

      get updateVAL() {
        return updateVAL;
      },

      get observable() {
        return observable;
      },
      get unobservable() {
        return unobservable;
      },
      get observe() {
        return observe;
      },
      get unobserve() {
        return unobserve;
      },

      get dependency() {
        return dependency;
      },
      get undependency() {
        return undependency;
      },
      get depend() {
        return depend;
      },
      get undepend() {
        return undepend;
      },

      get bridge() {
        return bridge;
      },
      get unbridge() {
        return unbridge;
      }
    }
  }, 0);

  // CREATE STORE

  // STORE METHODS
  define('subscribe', {
    value: (subscribe = noop) => {
      const _subscribe_ = (...a) => {
        isBreak = true;
        // _lastStore = Writable;
        const res = subscribe(...a);
        (isBreak = false), queueStart();
        return res;
      };

      const subscriber = [_subscribe_, Writable.get, _get_last_observed_values];
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

  // GET
  define('get', { writable: true, value: () => VAL }, 1);

  // SET
  define('set', { value: newVAL => updateVAL(newVAL, -1) }, 1);
  define('setWeak', {
    value: (newVAL, deep = 0) => updateVAL(newVAL, deep)
  }, 1);
  define('setSure', { value: newVAL => updateVAL(newVAL, null) }, 1);

  // UPDATE
  define('update', { value: update => updateVAL(update(VAL), -1) }, 1);
  define('updateWeak', {
    value: (update, deep = 0) => updateVAL(update(VAL), deep)
  }, 1);
  define('updateSure', { value: update => updateVAL(update(VAL), null) }, 1);

  // NEXT
  define('next', { get: () => Writable.set });

  // GET AND SET VALUE
  [0, '$', 'value'].forEach(v => {
    define(v, {
      enumerable: !v,
      get: () => Writable.get(),
      set: newVAL => Writable.set(newVAL)
    });
  });

  // OBSERVABLE
  define('observable', { value: observable }, 1);
  define('unobservable', { value: unobservable }, 1);
  // OBSERVE
  define('observe', { value: observe }, 1);
  define('unobserve', { value: unobserve }, 1);

  // DEPENDENCY
  define('dependency', { value: store => dependency(store, -1) }, 1);
  define('dependencyWeak', {
    value: (store, deep = 0) => dependency(store, deep)
  }, 1);
  define('dependencySure', { value: store => dependency(store, null) }, 1);
  define('undependency', { value: undependency }, 1);

  // DEPEND
  define('depend', { value: store => depend(store, -1) }, 1);
  define('dependWeak', { value: (store, deep = 0) => depend(store, deep) }, 1);
  define('dependSure', { value: store => depend(store, null) }, 1);
  define('undepend', { value: undepend }, 1);

  // BRIDGE
  define('bridge', { value: store => bridge(store, -1) }, 1);
  define('bridgeWeak', { value: (store, deep = 0) => bridge(store, deep) }, 1);
  define('bridgeSure', { value: store => bridge(store, null) }, 1);
  define('unbridge', { value: unbridge }, 1);

  // TYPE COERCION
  ['valueOf', 'toString', 'toJSON'].forEach(v => {
    define(v, {
      value: (...a) => (isVoid(VAL) || !VAL[v] ? VAL : VAL[v](...a))
    }, 1);
  });

  observe(_observed);
  depend(_depended);

  return Writable;
};
