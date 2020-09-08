const { QUEUE, WATCHERS_QUEUE } = require('./lib/consts.js');
const { IS_STORE, SET_AND_WATCH_METHODS } = require('./lib/consts.js');
const { noop, isVoid, thisIsStore, _define } = require('./lib');
const { fastEqual, deepEqual, baseEqual } = require('./lib/equals.js');

let _lastStore;

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
  const define = _define(Writable);

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
      WATCHERS_QUEUE.push(v);
      unwatchers.has(v) && v.set[unwatchers.get(v)](VAL);
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
    value: (_subscribe = noop) => {
      const subscribe = (...args) => {
        _lastStore = args[2];
        return _subscribe(...args);
      };

      const subscriber = { subscribe };
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
  }, 1);

  // SET AND UPDATE
  const set = newVAL => {
    return (!baseEqual(VAL, newVAL) && updateVAL(newVAL)) || Writable;
  };
  set.Weak = (newVAL, deep = 2) => {
    return (!deepEqual(VAL, newVAL, deep) && updateVAL(newVAL)) || Writable;
  };
  set.Sure = newVAL => {
    return updateVAL(newVAL) || Writable;
  };

  const update = update => set(update(VAL));
  update.Weak = (update, deep = 2) => set.Weak(update(VAL), deep);
  update.Sure = update => set.Sure(update(VAL));

  // const set = (newVAL, deep = 2, type = SET_AND_WATCH_METHODS[0]) => {
  //   switch (type) {
  //     case SET_AND_WATCH_METHODS[0]:
  //       return (!baseEqual(VAL, newVAL) && updateVAL(newVAL)) || Writable;
  //     case SET_AND_WATCH_METHODS[1]:
  //       return (!deepEqual(VAL, newVAL, deep) && updateVAL(newVAL)) || Writable;
  //     case SET_AND_WATCH_METHODS[2]:
  //       return updateVAL(newVAL) || Writable;
  //     default:
  //       throw new Error();
  //   }
  // };

  // const update = (update, deep = 2, type = SET_AND_WATCH_METHODS[0]) => {
  //   return set.Weak(update(VAL), deep, type);
  // };

  // WATCH
  const watcher = (store, type = SET_AND_WATCH_METHODS[0]) => {
    if (thisIsStore(store) && store !== Writable) {
      Writable.unwatcher(store);
      watchers.push(store), unwatchers.set(store, type);
      if (store._.watched.indexOf(Writable) < 0) store.watch(Writable);
      store.set[type](VAL);
    }
    return Writable;
  };

  const watch = (store, type = SET_AND_WATCH_METHODS[0]) => {
    if (thisIsStore(store) && store !== Writable) {
      Writable.unwatch(store), watched.push(store);
      if (store._.watchers.indexOf(Writable) < 0) store.watcher[type](Writable);
    }
    return Writable;
  };

  const bridge = (store, type = SET_AND_WATCH_METHODS[0]) => {
    if (store !== Writable) {
      Writable.watch[type](store);
      if (thisIsStore(store)) store.watch[type](Writable);
    }
    return Writable;
  };

  // [set, update, watcher, watch, bridge].forEach(fn => (fn.default = fn));
  const methods = { set, update, watcher, watch, bridge };
  Object.keys(methods).forEach(method => {
    SET_AND_WATCH_METHODS.forEach((v, k) => {
      if (!k) methods[method].default = methods[method];
      else if (k > 2) methods[method][v] = store => methods[method](store, v);

      define(`${method}${k ? v : ''}`, { value: methods[method][v] }, 1);
    });
  });

  define('unwatcher', {
    value: store => {
      const index = watchers.indexOf(store);
      if (index >= 0) {
        watchers.slice(index, 1), unwatchers.delete(store);
        if (store._.watched.indexOf(Writable) >= 0) store.unwatch(Writable);
      }
      return Writable;
    }
  }, 1);

  define('unwatch', {
    value: store => {
      const index = watched.indexOf(store);
      if (index >= 0) {
        watched.splice(index, 1);
        if (store._.watchers.indexOf(Writable) >= 0) store.unwatcher(Writable);
      }
      return Writable;
    }
  }, 1);

  define('unbridge', {
    value: store => {
      if (thisIsStore(store)) store.unwatch(Writable);
      Writable.unwatch(store);
      return Writable;
    }
  }, 1);

  // GET VALUE
  define('enabled', { get: () => !!stop });
  define('get', { writable: true, value: () => VAL });
  define(IS_STORE, { writable: false, value: thisIsStore });
  define('replaceObservers', { value: replaceObservers }, 0);
  define('_', {
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
  }, 0);
  define('next', { value: Writable.set }, 1);

  define('unobservedAll', {
    value: () => (Writable.replaceObservers() || 1) && Writable
  }, 1);
  define('unwatchAll', {
    value: () => (watched.forEach(v => Writable.unwatch(v)) || 1) && Writable
  }, 1);
  define('unwatcherAll', {
    value: () => (watchers.forEach(v => Writable.unwatcher(v)) || 1) && Writable
  }, 1);

  define('reset', {
    value: () => {
      Writable.unobservedAll(), Writable.unwatchAll(), Writable.unwatcherAll();
      return Writable;
    }
  }, 1);

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
      value: (...a) => (isVoid(VAL) || !VAL[v] ? VAL : VAL[v](...a))
    }, 1);
  });

  return Writable;
};
