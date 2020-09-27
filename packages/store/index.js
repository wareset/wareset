const { noop, define, isVoid, isFunc, forIn } = require('@wareset/utilites');
const { Store, isStore } = require('./lib/index');
const equal = require('./lib/equal');
const {
  watchableFactory,
  watchFactory,
  crossFactory
} = require('./lib/methods');

const QUEUE = [];
let _lastStore;

const _isNotValidParams = v => {
  return isStore(v) || !Array.isArray(v);
};

function __WaresetStore(VALUE, _observed, _depended, start) {
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

  const observed = [],
    observables = [];
  const depended = [],
    dependencies = [];

  const getObservedVALUES = () => {
    return observed.map(v => (isStore(v) ? v._.VALUE : v));
  };

  // CREATE WRITABLE
  const Writable = new Store();
  const defineWritable = define(Writable);

  let isBreak = false;
  const queueStart = () => {
    if (_lastStore === Writable) {
      let sub;
      // console.log('QUEUE.length', QUEUE.length);
      while (QUEUE.length) {
        if (isBreak) return;
        sub = QUEUE.pop();
        if (sub.enabled && !sub.executing && sub[0] === QUEUE.length) {
          sub.stop = sub[1](sub[2], sub[3], sub[4], sub.unsubscribe);
        }
      }
    }
  };

  const updateVALUE = (newVALUE, deep, _choice_) => {
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
          // for (let i = 0; i < subscribers.length; i += 1) {
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
          // for (let i = 0; i < dependencies.length; i += 2) {
          if (!dependencies[i]._.updating) {
            dependencies[i]._.updateVALUE(VALUE, dependencies[i + 1]);
          }
        }
      }

      if ((!_choice_ || _choice_[1]) && observables.length) {
        for (let i = observables.length; (i -= 2) >= 0; undefined) {
          // for (let i = 0; i < observables.length; i += 2) {
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
  defineWritable('subscribe', (subscribe = noop) => {
    const subscriber = [-1];
    const defineSubscriber = define(subscriber);
    let executing = false;
    defineSubscriber('executing', { get: () => executing });
    let enabled = true;
    defineSubscriber('enabled', { get: () => enabled });

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
    subscribers.push(subscriber);

    let initialized = false;
    const unsubscribe = () => {
      enabled = false;
      if (!initialized) initialized = true;
      else {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) subscribers.splice(index, 1);

        if (isFunc(subscriber.stop)) {
          subscriber.stop(VALUE, getObservedVALUES(), Writable, noop);
        }

        if (!subscribers.length) {
          if (stop) stop(VALUE, getObservedVALUES(), Writable, noop);
          stop = null;
        }
      }

      return Writable;
    };
    subscriber.unsubscribe = unsubscribe;

    if (!stop && subscribers.length) {
      stop = start(VALUE, getObservedVALUES(), Writable, unsubscribe);
      if (!isFunc(stop)) stop = noop;
    }

    subscriber.stop = runSUB(VALUE, getObservedVALUES(), Writable, unsubscribe);

    if (initialized) unsubscribe(), console.log(3434, VALUE);
    initialized = true;
    return unsubscribe;
  });

  // OBSERVABLE
  const [unobservable, observable] = watchableFactory(Writable, observables, [
    'observed',
    'unobserve',
    'observe',
    false,
    [1]
  ]);

  // OBSERVE
  const [unobserve, observe] = watchFactory(Writable, observed, [
    'observables',
    'unobservable',
    'observable'
  ]);

  // DEPENDENCY
  const [undependency, dependency] = watchableFactory(Writable, dependencies, [
    'depended',
    'undepend',
    'depend',
    true,
    false
  ]);

  // DEPEND
  const [undepend, depend] = watchFactory(Writable, depended, [
    'dependencies',
    'undependency',
    'dependency'
  ]);

  // BRIDGE
  const [unbridge, bridge] = crossFactory(
    Writable,
    undepend,
    depend,
    dependency,
    ['undepend', 'depend']
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
    }
  };
  defineWritable('_', { value: _service_ }, false);
  const defineServices = define(_service_);
  forIn({ isStore, updateVALUE }, (value, key) => {
    defineServices(key, { get: () => value });
  });
  forIn(
    { subscribers, observables, observed, dependencies, depended },
    (value, key) => defineServices(key, { get: () => [...value] })
  );

  // GET
  defineWritable('get', () => VALUE);

  // SET
  defineWritable('set', newVALUE => updateVALUE(newVALUE, -1));
  defineWritable('setWeak', (newVALUE, deep) =>
    updateVALUE(newVALUE, deep || 0)
  );
  defineWritable('setSure', newVALUE => updateVALUE(newVALUE, null));

  // UPDATE
  defineWritable('update', update =>
    updateVALUE(update(VALUE, getObservedVALUES(), Writable, noop), -1)
  );
  defineWritable('updateWeak', (update, deep) =>
    updateVALUE(update(VALUE, getObservedVALUES(), Writable, noop), deep || 0)
  );
  defineWritable('updateSure', update =>
    updateVALUE(update(VALUE, getObservedVALUES(), Writable, noop), null)
  );

  forIn({ observable, observe, dependency, depend, bridge }, (value, key) => {
    defineWritable(key, store => value(store, -1));
    defineWritable(`${key}Weak`, (store, deep) => value(store, deep || 0));
    defineWritable(`${key}Sure`, store => value(store, null));

    defineServices(key, { get: () => value });
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
      defineWritable(key, store => value(store));
      defineServices(key, { get: () => value });
    }
  );

  defineWritable('clear', () => {
    observable([]), observe([]), dependency([]), depend([]);
    return Writable;
  });

  defineWritable('reset', () => {
    Writable.clear();
    while (subscribers.length) subscribers[0].unsubscribe();
    if (subscribers.length) Writable.reset();
    return Writable;
  });

  // NEXT
  defineWritable('next', { get: () => Writable.set });

  // GET AND SET VALUEUE
  [0, '$', 'value'].forEach(v => {
    defineWritable(v, {
      enumerable: !v,
      get: () => Writable.get(),
      set: newVALUE => Writable.set(newVALUE)
    });
  });

  // TYPE COERCION
  ['valueOf', 'toString', 'toJSON'].forEach(v => {
    defineWritable(v, (...a) =>
      isVoid(VALUE) || !VALUE[v] ? VALUE : VALUE[v](...a)
    );
  });

  observe(_observed);
  depend(_depended);

  return Writable;
}
__WaresetStore.isStore = isStore;

module.exports = __WaresetStore;
