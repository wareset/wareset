// const typed = require('@wareset/typed');
const noop = () => {};
const isVoid = v => v === null || v === undefined;

const deepEqual = require('@wareset/deep-equal');
const fastEqual = (a, b) => deepEqual(a, b, 0);
const baseEqual = (a, b) => {
  return !(
    (a && (typeof a === 'object' || typeof a === 'function')) ||
    !fastEqual(a, b)
  );
};

let _lastStore;
const QUEUE = [];
const WATCHERS_QUEUE = [];
const IS_STORE = '__is_store__';

const thisIsStore = check_store => {
  return Array.isArray(check_store) && check_store[IS_STORE] === thisIsStore;
};

module.exports = function store(VAL, observed = [], start = noop) {
  if (typeof observed === 'function') (start = observed), (observed = []);
  if (thisIsStore(observed) || !Array.isArray(observed)) observed = [observed];
  else observed = [...observed];

  const stores = () => observed.map(v => (thisIsStore(v) ? v.$ : v));

  let stop = null;
  const watched = [];
  const watchers = [];
  const unwatchers = new Map();
  const unobserved = [];
  const subscribers = [];

  // CREATE WRITABLE
  const Writable = [];
  const define = (prop, _props) => {
    const props = {
      enumerable: false,
      configurable: false,
      ..._props
    };
    Object.defineProperty(Writable, prop, props);
  };

  const updateVAL = newVAL => {
    if (QUEUE.length > 250) {
      throw new Error(`@wareset/store - QUEUE > 250 - ${QUEUE.length}`);
    }

    VAL = newVAL;

    WATCHERS_QUEUE.push(_lastStore);
    if (stop) {
      let i, nextStore;
      const run_queue = !QUEUE.length;
      for (i = 0; i < subscribers.length; i += 1) {
        QUEUE.push(subscribers[i], VAL, stores(), Writable);
      }
      if (run_queue) {
        for (i = 0; i < QUEUE.length; i += 4) {
          nextStore = QUEUE[i + 3];
          if (nextStore !== _lastStore || Writable === _lastStore) {
            QUEUE[i].subscribe(QUEUE[i + 1], QUEUE[i + 2], nextStore);
          }
        }
        QUEUE.length = 0;
      }
    }

    watchers.forEach(v => {
      if (WATCHERS_QUEUE.indexOf(v) >= 0 && fastEqual(v.$, VAL)) return;
      WATCHERS_QUEUE.push(v), unwatchers.has(v) && v[unwatchers.get(v)](VAL);
    });
    (_lastStore = Writable), (WATCHERS_QUEUE.length = 0);

    return Writable;
  };

  const replaceObservers = (...stores) => {
    unobserved.forEach(v => v()), (unobserved.length = 0), (observed = stores);
    if (subscribers.length) {
      observed.forEach(v => {
        thisIsStore(v) && unobserved.push(v.subscribe(() => updateVAL(VAL)));
      });
    }
  };
  replaceObservers(...observed);

  // CREATE STORE
  // STORE METHODS
  define('subscribe', {
    writable: true,
    value: (_subscribe = noop) => {
      const subscribe = (...args) => {
        _lastStore = args[2];
        return _subscribe(...args);
      };

      const subscriber = { store: Writable, subscribe };
      subscribers.push(subscriber);

      if (!stop && subscribers.length) {
        replaceObservers(...observed);
        stop = start(Writable.set, stores()) || noop;
      }
      subscribe(VAL, stores(), Writable);

      const unsubscribe = () => {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) subscribers.splice(index, 1);
        if (!subscribers.length) {
          replaceObservers(...observed);
          if (stop) stop(), (stop = null);
        }
      };

      subscriber.unsubscribe = unsubscribe;
      return unsubscribe;
    }
  });

  // SET AND UPDATE
  define('setWeak', {
    writable: true,
    value: (newVAL, deep = 2) => {
      return (!deepEqual(VAL, newVAL, deep) && updateVAL(newVAL)) || Writable;
    }
  });
  define('updateWeak', {
    writable: true,
    value: (update, deep = 2) => Writable.setWeak(update(VAL), deep)
  });

  define('set', {
    writable: true,
    value: newVAL => (!baseEqual(VAL, newVAL) && updateVAL(newVAL)) || Writable
  });
  define('update', {
    writable: true,
    value: update => Writable.set(update(VAL))
  });

  define('setSure', { writable: true, value: newVAL => updateVAL(newVAL) });
  define('updateSure', {
    writable: true,
    value: update => Writable.setForce(update(VAL))
  });

  define('next', { writable: true, value: Writable.set });

  // WATCH
  const watcher = (store, type = 'set') => {
    if (thisIsStore(store) && store !== Writable) {
      Writable.unwatcher(store);
      watchers.push(store), unwatchers.set(store, type);
      if (store._.watched.indexOf(Writable) < 0) store.watch(Writable);
      store[type](VAL);
    }
    return Writable;
  };

  define('watcher', { writable: true, value: watcher });
  define('unwatcher', {
    writable: true,
    value: store => {
      const index = watchers.indexOf(store);
      if (index >= 0) {
        watchers.slice(index, 1), unwatchers.delete(store);
        if (store._.watched.indexOf(Writable) >= 0) store.unwatch(Writable);
      }
      return Writable;
    }
  });

  const watch = (store, type = 'base') => {
    if (thisIsStore(store) && store !== Writable) {
      Writable.unwatch(store), watched.push(store);
      if (store._.watchers.indexOf(Writable) < 0) store.watcher[type](Writable);
    }
    return Writable;
  };

  define('watch', { writable: true, value: watch });
  define('unwatch', {
    writable: true,
    value: store => {
      const index = watched.indexOf(store);
      if (index >= 0) {
        watched.splice(index, 1);
        if (store._.watchers.indexOf(Writable) >= 0) store.unwatcher(Writable);
      }
      return Writable;
    }
  });

  const bridge = (store, type = 'base') => {
    if (store !== Writable) {
      Writable.watch[type](store);
      if (thisIsStore(store)) store.watch[type](Writable);
    }
    return Writable;
  };

  ['base', 'Weak', 'Sure'].forEach((v, k) => {
    watcher[v] = store => watcher(store, `set${!k ? '' : v}`);
    watch[v] = store => watch(store, v);
    bridge[v] = store => bridge(store, v);
  });

  define('bridge', { writable: true, value: bridge });
  define('unbridge', {
    writable: true,
    value: store => {
      if (thisIsStore(store)) store.unwatch(Writable);
      Writable.unwatch(store);
      return Writable;
    }
  });

  // GET VALUE
  define('enabled', { get: () => !!stop });
  define('get', { writable: true, value: () => VAL });
  define(IS_STORE, { writable: false, value: thisIsStore });
  define('replaceObservers', {
    writable: false,
    value: replaceObservers
  });
  define('_', {
    writable: false,
    value: {
      get watched() {
        return [...watched];
      },
      get watchers() {
        return [...watchers];
      },
      get observed() {
        return [...observed];
      },
      get subscribers() {
        return [...subscribers];
      }
    }
  });

  // GET VALUE AND SET NEW VALUE
  [0, '$', 'value'].forEach(v => {
    define(v, {
      enumerable: !v,
      get: () => VAL,
      set: newVAL => Writable.set(newVAL)
    });
  });

  // TYPE COERCION
  ['valueOf', 'toString', 'toJSON'].forEach(v => {
    define(v, {
      writable: true,
      value: (...a) => (isVoid(VAL) || !VAL[v] ? VAL : VAL[v](...a))
    });
  });

  return Writable;
};
