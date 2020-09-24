const {
  noop,
  isVoid,
  isStore,
  definer,
  forIn,
  isFunc,
  // inArr
} = require('./lib/index');
const equal = require('./lib/equal');
const {
  watchableFactory,
  watchFactory,
  crossFactory,
} = require('./lib/methods');

const QUEUE = [];
let _lastStore;

const _isNotValidParams = (v) => {
  return isStore(v) || !Array.isArray(v);
};

function WaresetStore(VALUE, _observed = [], _depended = [], start = noop) {
  if (isFunc(_observed)) (start = _observed), (_observed = []);
  if (isFunc(_depended)) (start = _depended), (_depended = []);
  if (!isFunc(start)) start = noop;

  _observed = _isNotValidParams(_observed) ? [_observed] : [..._observed];
  _depended = _isNotValidParams(_depended) ? [_depended] : [..._depended];

  let stop = null;
  let previousVALUE;
  let previousDifferingVALUE;
  let updating = false;

  const subscribers = [];

  const observed = [];
  const observables = [];
  const depended = [];
  const dependencies = [];

  const getObservedVALUES = () => {
    return observed.map((v) => (isStore(v) ? v._.VALUE : v));
  };

  // CREATE WRITABLE
  const Writable = [];
  const define = definer(Writable);

  let isBreak = false;
  const queueStart = () => {
    if (_lastStore === Writable) {
      let sub;
      // console.log('QUEUE.length', QUEUE.length);
      while (QUEUE.length) {
        if (isBreak) return;
        sub = QUEUE.pop();
        if (sub.enabled && !sub.executing && sub[0] === QUEUE.length) {
          sub[1](sub[2], sub[3], sub[4], sub.unsubscribe);
        }
      }
    }
  };

  const updateVALUE = (newVALUE, deep = null, _choice_ = false) => {
    if (!equal(VALUE, newVALUE, deep)) {
      updating = true;
      previousVALUE = VALUE;
      if (!equal(VALUE, newVALUE, 0)) previousDifferingVALUE = VALUE;
      VALUE = newVALUE;

      const isLast = _lastStore !== Writable;
      const isOnly = !observables.length && !dependencies.length;
      // _lastStore = Writable;

      if ((!_choice_ || _choice_[0]) && stop && subscribers.length) {
        const observedVALUES = getObservedVALUES();
        for (let i = subscribers.length; i-- > 0; undefined) {
          if (isLast || (!subscribers[i].executing && isOnly)) {
            subscribers[i][0] = QUEUE.length;
            subscribers[i][2] = VALUE;
            subscribers[i][3] = observedVALUES;
            QUEUE.push(subscribers[i]);
          }
        }
      }

      _lastStore = Writable;

      if ((!_choice_ || _choice_[2]) && dependencies.length) {
        for (let i = dependencies.length; (i -= 2) >= 0; undefined) {
          if (!dependencies[i]._.updating) {
            dependencies[i]._.updateVALUE(VALUE, dependencies[i + 1]);
          }
        }
      }

      if ((!_choice_ || _choice_[1]) && observables.length) {
        for (let i = observables.length; (i -= 2) >= 0; undefined) {
          if (
            !observables[i]._.updating &&
            !equal(VALUE, previousVALUE, observables[i + 1])
          ) {
            observables[i]._.updateVALUE(observables[i]._.VALUE, null, [1]);
          }
        }
      }

      queueStart();
      updating = false;
    }
    return Writable;
  };

  // CREATE STORE
  // STORE METHODS
  define('subscribe', {
    value: (subscribe = noop) => {
      const subscriber = [-1];
      const defineSubscriber = definer(subscriber);
      let executing = false;
      defineSubscriber('executing', {get: () => executing});
      let enabled = true;
      defineSubscriber('enabled', {get: () => enabled});

      const runSUB = (...a) => {
        isBreak = true;
        executing = true;
        _lastStore = Writable;
        const res = subscribe(...a);
        executing = false;
        (isBreak = false), queueStart();
        return res;
      };

      subscriber.push(runSUB, VALUE, [], Writable);

      let initialized = false;
      const unsubscribe = () => {
        enabled = false;
        if (!initialized) initialized = true;
        else {
          const index = subscribers.indexOf(subscriber);
          if (index !== -1) subscribers.splice(index, 1);

          subscriber.stop(VALUE, getObservedVALUES(), Writable, noop);
          if (!subscribers.length) {
            if (stop) stop(VALUE, getObservedVALUES(), Writable, noop);
            stop = null;
          }
        }

        return Writable;
      };
      subscriber.unsubscribe = unsubscribe;
      subscribers.push(subscriber);

      if (!stop && subscribers.length) {
        stop = start(VALUE, getObservedVALUES(), Writable, unsubscribe);
        if (!isFunc(stop)) stop = noop;
      }

      let stopSUB = runSUB(VALUE, getObservedVALUES(), Writable, unsubscribe);
      if (!isFunc(stopSUB)) stopSUB = noop;
      defineSubscriber('stop', {value: stopSUB});

      if (initialized) unsubscribe();
      else initialized = true;
      return unsubscribe;
    },
  }, 1);

  // OBSERVABLE
  const [unobservable, observable] = watchableFactory(Writable, observables, [
    'observed',
    'unobserve',
    'observe',
    false,
    [1],
  ]);

  // OBSERVE
  const [unobserve, observe] = watchFactory(Writable, observed, [
    'observables',
    'unobservable',
    'observable',
  ]);

  // DEPENDENCY
  const [undependency, dependency] = watchableFactory(Writable, dependencies, [
    'depended',
    'undepend',
    'depend',
    true,
    false,
  ]);

  // DEPEND
  const [undepend, depend] = watchFactory(Writable, depended, [
    'dependencies',
    'undependency',
    'dependency',
  ]);

  // BRIDGE
  const [unbridge, bridge] = crossFactory(
    Writable,
    undepend,
    depend,
    dependency,
    ['undepend', 'depend'],
  );

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
    },
  };
  define('_', {value: _service_}, 0);
  const defineServices = definer(_service_);
  forIn({isStore, updateVALUE}, (value, key) => {
    defineServices(key, {get: () => value});
  });
  forIn(
    {subscribers, observables, observed, dependencies, depended},
    (value, key) => defineServices(key, {get: () => [...value]}),
  );

  // GET
  define('get', {value: () => VALUE}, 1);

  // SET
  define('set', {value: (newVALUE) => updateVALUE(newVALUE, -1)}, 1);
  define('setWeak', {
    value: (newVALUE, deep = 0) => updateVALUE(newVALUE, deep),
  }, 1);
  define('setSure', {value: (newVALUE) => updateVALUE(newVALUE, null)}, 1);

  // UPDATE
  define('update', {
    value: (update) => {
      return updateVALUE(
        update(VALUE, getObservedVALUES(), Writable, noop),
        -1,
      );
    },
  }, 1);
  define('updateWeak', {
    value: (update, deep = 0) => {
      return updateVALUE(
        update(VALUE, getObservedVALUES(), Writable, noop),
        deep,
      );
    },
  }, 1);
  define('updateSure', {
    value: (update) => {
      return updateVALUE(
        update(VALUE, getObservedVALUES(), Writable, noop),
        null,
      );
    },
  }, 1);

  forIn({observable, observe, dependency, depend, bridge}, (value, key) => {
    define(key, {value: (store) => value(store, -1)}, 1);
    define(`${key}Weak`, {value: (store, deep = 0) => value(store, deep)}, 1);
    define(`${key}Sure`, {value: (store) => value(store, null)}, 1);

    defineServices(key, {get: () => value});
  });

  forIn(
    {
      unobservable,
      unobserve,
      undependency,
      undepend,
      unbridge,
    },
    (value, key) => {
      define(key, {value}, 1);
      defineServices(key, {get: () => value});
    },
  );

  define('clear', {
    value: () => {
      observable([]), observe([]), dependency([]), depend([]);
      return Writable;
    },
  }, 1);

  define('reset', {
    value: () => {
      Writable.clear();
      subscribers.forEach((sub) => sub.unsubscribe());
      return Writable;
    },
  }, 1);

  // NEXT
  define('next', {get: () => Writable.set});

  // GET AND SET VALUEUE
  [0, '$', 'value'].forEach((v) => {
    define(v, {
      enumerable: !v,
      get: () => Writable.get(),
      set: (newVALUE) => Writable.set(newVALUE),
    });
  });

  // TYPE COERCION
  ['valueOf', 'toString', 'toJSON'].forEach((v) => {
    define(v, {
      value: (...a) => (isVoid(VALUE) || !VALUE[v] ? VALUE : VALUE[v](...a)),
    }, 1);
  });

  observe(_observed);
  depend(_depended);

  return Writable;
}
WaresetStore.isStore = isStore;

module.exports = WaresetStore;
