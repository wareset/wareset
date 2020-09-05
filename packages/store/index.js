const equal = require('@wareset/deep-equal');

function noop() {}
const isVoid = v => v === null || v === undefined;
const define = (obj, prop, _props) => {
  const props = {
    enumerable: false,
    configurable: false,
    ..._props
  };
  Object.defineProperty(obj, prop, props);
};

const QUEUE = [];

module.exports = function store(VAL, start = noop, deep = 0) {
  if (typeof start !== 'function') (deep = start), (start = noop);

  let stop = null;
  const subscribers = [];

  // CREATE WRITABLE
  const Writable = [];

  // CREATE STORE
  // STORE METHODS
  define(Writable, 'subscribe', {
    writable: true,
    value: (subscribe = noop, invalidate = noop) => {
      const subscriber = { subscribe, invalidate };
      subscribers.push(subscriber);

      if (subscribers.length === 1) stop = start(Writable.set) || noop;
      subscribe(VAL);

      const unsubscribe = () => {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) subscribers.splice(index, 1);
        if (subscribers.length === 0) stop(), (stop = null);
      };

      subscriber.unsubscribe = unsubscribe;
      return unsubscribe;
    }
  });

  define(Writable, 'set', {
    writable: true,
    value: newValue => {
      if ((!deep && typeof VAL === 'object') || !equal(VAL, newValue, deep)) {
        VAL = newValue;
        if (stop) {
          const run_queue = !QUEUE.length;
          for (let i = 0; i < subscribers.length; i += 1) {
            const s = subscribers[i];
            s.invalidate();
            QUEUE.push(s, VAL);
          }
          if (run_queue) {
            for (let i = 0; i < QUEUE.length; i += 2) {
              QUEUE[i].subscribe(QUEUE[i + 1]);
            }
            QUEUE.length = 0;
          }
        }
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

  // GET VALUE
  define(Writable, 'get', { writable: false, value: () => VAL });
  define(Writable, 'subscribers', { get: () => subscribers });

  // GET VALUE AND SET NEW VALUE
  define(Writable, 'value', {
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
