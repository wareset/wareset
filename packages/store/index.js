const { IS_STORE } = require('./lib/consts');
const { noop, isVoid, thisIsStore, definer, forIn } = require('./lib/index');
const equal = require('./lib/equal');
const {
  unwatchable,
  watchable,
  unwatch,
  watch,
  uncross,
  cross
} = require('./lib/methods');

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
    last_observed_values = observed.map(v => (thisIsStore(v) ? v._.VAL : v));
    return last_observed_values;
  };

  // CREATE WRITABLE
  const Writable = [];
  const define = definer(Writable);

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
    const oldVAL = VAL;
    if (!equal(VAL, newVAL, deep)) {
      updating = true;
      if (!equal(VAL, newVAL, 0)) previousVAL = VAL;
      VAL = newVAL;

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
          subscribers[i][1] = VAL;
          subscribers[i][2] = last_observed_values;
          subscribers[i][4] = QUEUE.length;
          QUEUE.push(subscribers[i]);
        }
      }

      if ((!_choice_ || _choice_[1]) && observables.length) {
        for (let i = observables.length; (i -= 2) >= 0; undefined) {
          if (
            !observables[i]._.updating &&
            !equal(VAL, oldVAL, observables[i + 1])
          ) {
            observables[i]._.updateVAL(observables[i]._.VAL, null, [1]);
          }
        }
      }

      updating = false;

      queueStart();
    }

    return Writable;
  };

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
      _subscribe_(VAL, _get_last_observed_values(), Writable);

      const unsubscribe = () => {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) subscribers.splice(index, 1);
        if (!subscribers.length) stop && stop(), (stop = null);
      };

      subscriber.push(unsubscribe, 0);
      return unsubscribe;
    }
  }, 1);

  // OBSERVABLE
  // const unobservable = store => {
  //   if (thisIsStore(store)) {
  //     const index = observables.indexOf(store);
  //     if (index !== -1) {
  //       observables.splice(index, 2);
  //       if (inArr(store._.observed, Writable)) {
  //         store._.unobserve(Writable);
  //       }
  //     }
  //   } else if (Array.isArray(store)) {
  //     store.forEach(v => unobservable(v));
  //   }
  //   return Writable;
  // };
  const unobservable = unwatchable(Writable, observables, [
    'observed',
    'unobserve'
  ]);
  // const observable = (store, deep = -1) => {
  //   if (thisIsStore(store)) {
  //     if (store !== Writable) {
  //       unobservable(store), observables.push(store, deep);
  //       if (!inArr(store._.observed, Writable)) {
  //         store._.observe(Writable, deep);
  //       }
  //       store._.updateVAL(store._.VAL, deep, [1]);
  //     }
  //   } else if (Array.isArray(store)) {
  //     unobservable(observables), store.forEach(v => observable(v, deep));
  //   }
  //   return Writable;
  // };
  const observable = watchable(Writable, observables, unobservable, [
    'observed',
    'observe',
    false,
    [1]
  ]);

  // OBSERVE
  // const unobserve = store => {
  //   if (thisIsStore(store)) {
  //     const index = observed.indexOf(store);
  //     if (index !== -1) {
  //       observed.splice(index, 1);
  //       if (inArr(store._.observables, Writable)) {
  //         store._.unobservable(Writable);
  //       }
  //     }
  //   } else if (Array.isArray(store)) {
  //     store.forEach(v => unobserve(v));
  //   }
  //   return Writable;
  // };
  const unobserve = unwatch(Writable, observed, [
    'observables',
    'unobservable'
  ]);
  // const observe = (store, deep = -1) => {
  //   if (thisIsStore(store)) {
  //     if (store !== Writable) {
  //       unobserve(store), observed.push(store);
  //       if (!inArr(store._.observables, Writable)) {
  //         store._.observable(Writable, deep);
  //       }
  //     }
  //   } else if (Array.isArray(store)) {
  //     unobserve(observed), store.forEach(v => observe(v, deep));
  //   }
  //   return Writable;
  // };
  const observe = watch(Writable, observed, unobserve, [
    'observables',
    'observable'
  ]);

  // DEPENDENCY
  // const undependency = store => {
  //   if (thisIsStore(store)) {
  //     const index = dependencies.indexOf(store);
  //     if (index !== -1) {
  //       dependencies.splice(index, 2);
  //       if (inArr(store._.depended, Writable)) {
  //         store._.undepend(Writable);
  //       }
  //     }
  //   } else if (Array.isArray(store)) {
  //     store.forEach(v => undependency(v));
  //   }
  //   return Writable;
  // };
  const undependency = unwatchable(Writable, dependencies, [
    'depended',
    'undepend'
  ]);
  // const dependency = (store, deep = -1) => {
  //   if (thisIsStore(store)) {
  //     if (store !== Writable) {
  //       undependency(store), dependencies.push(store, deep);
  //       if (!inArr(store._.depended, Writable)) {
  //         store._.depend(Writable, deep);
  //       }
  //       store._.updateVAL(Writable._.VAL, deep, false);
  //     }
  //   } else if (Array.isArray(store)) {
  //     undependency(dependencies), store.forEach(v => dependency(v, deep));
  //   }
  //   return Writable;
  // };
  const dependency = watchable(Writable, dependencies, undependency, [
    'depended',
    'depend',
    true,
    false
  ]);

  // DEPEND
  // const undepend = store => {
  //   if (thisIsStore(store)) {
  //     const index = depended.indexOf(store);
  //     if (index !== -1) {
  //       depended.splice(index, 1);
  //       if (inArr(store._.dependencies, Writable)) {
  //         store._.undependency(Writable);
  //       }
  //     }
  //   } else if (Array.isArray(store)) {
  //     store.forEach(v => undepend(v));
  //   }
  //   return Writable;
  // };
  const undepend = unwatch(Writable, depended, [
    'dependencies',
    'undependency'
  ]);
  // const depend = (store, deep = -1) => {
  //   if (thisIsStore(store)) {
  //     if (store !== Writable) {
  //       undepend(store), depended.push(store);
  //       if (!inArr(store._.dependencies, Writable)) {
  //         store._.dependency(Writable, deep);
  //       }
  //     }
  //   } else if (Array.isArray(store)) {
  //     undepend(depended), store.forEach(v => depend(v, deep));
  //   }
  //   return Writable;
  // };
  const depend = watch(Writable, depended, undepend, [
    'dependencies',
    'dependency'
  ]);

  // BRIDGE
  // const unbridge = store => {
  //   if (thisIsStore(store)) store._.undepend(Writable), undepend(store);
  //   else if (Array.isArray(store)) store.forEach(v => unbridge(v));
  //   return Writable;
  // };
  const unbridge = uncross(Writable, undepend, ['undepend']);
  // const bridge = (store, deep = -1) => {
  //   if (thisIsStore(store)) {
  //     if (store !== Writable) {
  //       unbridge(store), depend(store, deep), store._.depend(Writable, deep);
  //     }
  //   } else if (Array.isArray(store)) {
  //     dependency([]), depend([]), store.forEach(v => bridge(v, deep));
  //   }
  //   return Writable;
  // };
  const bridge = cross(Writable, unbridge, depend, dependency, ['depend']);

  const _services_ = {
    get VAL() {
      return VAL;
    },
    get previousVAL() {
      return previousVAL;
    },
    get updating() {
      return updating;
    }
  };
  define('_', { value: _services_ }, 0);
  const define_services = definer(_services_);
  forIn({ [IS_STORE]: thisIsStore, updateVAL }, (value, key) => {
    define_services(key, { get: () => value });
  });
  forIn(
    { subscribers, observables, observed, dependencies, depended },
    (value, key) => define_services(key, { get: () => [...value] })
  );

  // GET
  define('get', { value: () => VAL }, 1);

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

  forIn({ observable, observe, dependency, depend, bridge }, (value, key) => {
    define(key, { value: store => value(store, -1) }, 1);
    define(`${key}Weak`, { value: (store, deep = 0) => value(store, deep) }, 1);
    define(`${key}Sure`, { value: store => value(store, null) }, 1);

    define_services(key, { get: () => value });
  });

  forIn(
    {
      unobservable,
      unobserve,
      undependency,
      undepend,
      unbridge
    },
    (value, key) => {
      define(key, { value }, 1);
      define_services(key, { get: () => value });
    }
  );

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
