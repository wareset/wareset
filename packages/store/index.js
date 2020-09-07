// const typed = require('@wareset/typed');
const deepEqual = require('@wareset/deep-equal');

function noop() {}
function not_equal(a, b) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

const isVoid = v => v === null || v === undefined;
const define = (obj, prop, _props) => {
  const props = {
    enumerable: false,
    configurable: false,
    ..._props
  };
  Object.defineProperty(obj, prop, props);
};

const IS_STORE = '__is_store__';

function thisIsStore(check_value) {
  return Array.isArray(check_value) && check_value[IS_STORE] === thisIsStore;
}

const QUEUE = [];

module.exports = function store(VAL, observable = [], start = noop) {
  if (typeof observable === 'function') (start = observable), (observable = []);
  if (thisIsStore(observable)) observable = [observable];

  const stores = () => observable.map(v => (thisIsStore(v) ? v.$ : v));

  let stop = null;
  const subscribers = [];
  const unobservable = [];

  // CREATE WRITABLE
  const Writable = [];

  const updateSubscribes = newValue => {
    VAL = newValue;
    if (stop) {
      const run_queue = !QUEUE.length;
      for (let i = 0; i < subscribers.length; i += 1) {
        const s = subscribers[i];
        s.invalidate();
        QUEUE.push(s, VAL, stores());
      }
      if (run_queue) {
        for (let i = 0; i < QUEUE.length; i += 3) {
          QUEUE[i].subscribe(QUEUE[i + 1], QUEUE[i + 2]);
        }
        QUEUE.length = 0;
      }
    }
  };

  // CREATE STORE
  // STORE METHODS
  define(Writable, 'subscribe', {
    writable: true,
    value: (subscribe = noop, invalidate = noop) => {
      const subscriber = { subscribe, invalidate };
      subscribers.push(subscriber);

      if (subscribers.length === 1) {
        observable.forEach(v => {
          thisIsStore(v) &&
            unobservable.push(v.subscribe(() => stop && updateSubscribes(VAL)));
        });
        stop = start(Writable.set) || noop;
      }
      subscribe(VAL, stores());

      const unsubscribe = () => {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) subscribers.splice(index, 1);
        if (subscribers.length === 0) {
          stop(), (stop = null);
          unobservable.forEach(v => v()), (unobservable.length = 0);
        }
      };

      subscriber.unsubscribe = unsubscribe;
      return unsubscribe;
    }
  });

  define(Writable, 'setWeak', {
    writable: true,
    value: (newValue, deep = 1) => {
      if (!deepEqual(VAL, newValue, deep)) {
        updateSubscribes(newValue);
      }
      return Writable;
    }
  });
  define(Writable, 'updateWeak', {
    writable: true,
    value: (update, deep = 1) => {
      Writable.weakSet(update(VAL), deep);
      return Writable;
    }
  });

  define(Writable, 'set', {
    writable: true,
    value: newValue => {
      if (not_equal(VAL, newValue)) {
        updateSubscribes(newValue);
      }
      return Writable;
    }
  });
  define(Writable, 'update', {
    writable: true,
    value: update => {
      Writable.set(update(VAL));
      return Writable;
    }
  });

  define(Writable, 'setForce', {
    writable: true,
    value: newValue => {
      updateSubscribes(newValue);
      return Writable;
    }
  });
  define(Writable, 'updateForce', {
    writable: true,
    value: update => {
      Writable.forceSet(update(VAL));
      return Writable;
    }
  });

  // GET VALUE
  define(Writable, 'get', { writable: true, value: () => VAL });
  define(Writable, 'observable', { get: () => [...observable] });
  define(Writable, 'subscribers', { get: () => [...subscribers] });
  define(Writable, IS_STORE, { writable: false, value: thisIsStore });

  // GET VALUE AND SET NEW VALUE
  define(Writable, 'value', {
    get: () => VAL,
    set: newVAL => Writable.set(newVAL)
  });

  define(Writable, '$', {
    get: () => VAL,
    set: newVAL => Writable.set(newVAL)
  });

  define(Writable, 0, {
    enumerable: true,
    get: () => VAL,
    set: newVAL => Writable.set(newVAL)
  });

  // TYPE COERCION
  define(Writable, 'valueOf', {
    writable: true,
    value: (...a) => (isVoid(VAL) || !VAL.valueOf ? VAL : VAL.valueOf(...a))
  });

  define(Writable, 'toString', {
    writable: true,
    value: (...a) => (isVoid(VAL) || !VAL.toString ? VAL : VAL.toString(...a))
  });

  define(Writable, 'toJSON', {
    writable: true,
    value: (...a) => (isVoid(VAL) || !VAL.toJSON ? VAL : VAL.toJSON(...a))
  });

  return Writable;
};
