const { QUEUE, IS_STORE } = require('./lib/consts');
const {
  noop,
  isVoid,
  thisIsStore,
  definer,
  forIn,
  isFunc
} = require('./lib/index');
const equal = require('./lib/equal');
const {
  watchable_factory,
  watch_factory,
  cross_factory
} = require('./lib/methods');

let _lastStore;

const _is_not_valid_params = v => {
  return thisIsStore(v) || !Array.isArray(v);
};

module.exports = function WaresetStore(
  VALUE,
  _observed = [],
  _depended = [],
  start = noop
) {
  if (isFunc(_observed)) (start = _observed), (_observed = []);
  if (isFunc(_depended)) (start = _depended), (_depended = []);
  if (!isFunc(start)) start = noop;

  _observed = _is_not_valid_params(_observed) ? [_observed] : [..._observed];
  _depended = _is_not_valid_params(_depended) ? [_depended] : [..._depended];

  let stop = null;
  let previousVALUE, previousDifferingVALUE;
  let updating = false;

  const subscribers = [];

  const observed = [],
    observables = [];
  const depended = [],
    dependencies = [];

  let last_observed_values = [];
  const _get_last_observed_values = () => {
    last_observed_values = observed.map(v => (thisIsStore(v) ? v._.VALUE : v));
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
        if (sub[0] === QUEUE.length) {
          sub[1](sub[2], sub[3], sub[4], sub[5]);
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

      if ((!_choice_ || _choice_[2]) && dependencies.length) {
        for (let i = dependencies.length; (i -= 2) >= 0; undefined) {
          if (!dependencies[i]._.updating) {
            dependencies[i]._.updateVALUE(VALUE, dependencies[i + 1]);
          }
        }
      }

      _lastStore = Writable;

      if ((!_choice_ || _choice_[0]) && stop && subscribers.length) {
        _get_last_observed_values();
        for (let i = subscribers.length; i-- > 0; undefined) {
          subscribers[i][0] = QUEUE.length;
          subscribers[i][2] = VALUE;
          subscribers[i][3] = last_observed_values;
          QUEUE.push(subscribers[i]);
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
      const subscriber = [-1, _subscribe_, VALUE, [], Writable];
      subscribers.push(subscriber);

      let initialized = false;
      const unsubscribe = () => {
        if (!initialized) initialized = true;
        else {
          const index = subscribers.indexOf(subscriber);
          if (index !== -1) subscribers.splice(index, 1);

          if (isFunc(subscriber[6])) {
            subscriber[6](VALUE, _get_last_observed_values(), Writable, noop);
          }

          if (!subscribers.length) {
            if (stop) stop(VALUE, _get_last_observed_values(), Writable, noop);
            stop = null;
          }
        }

        return Writable;
      };
      subscriber.push(unsubscribe);

      if (!stop && subscribers.length) {
        // const _unsub_ = () => (_first_unsub_ = true);
        stop = start(VALUE, _get_last_observed_values(), Writable, unsubscribe);
        if (!isFunc(stop)) stop = noop;
      }

      subscriber.push(
        _subscribe_(VALUE, _get_last_observed_values(), Writable, unsubscribe)
      );

      if (initialized) unsubscribe();
      initialized = true;
      return unsubscribe;
    }
  }, 1);

  // OBSERVABLE
  const [unobservable, observable] = watchable_factory(Writable, observables, [
    'observed',
    'unobserve',
    'observe',
    false,
    [1]
  ]);

  // OBSERVE
  const [unobserve, observe] = watch_factory(Writable, observed, [
    'observables',
    'unobservable',
    'observable'
  ]);

  // DEPENDENCY
  const [undependency, dependency] = watchable_factory(Writable, dependencies, [
    'depended',
    'undepend',
    'depend',
    true,
    false
  ]);

  // DEPEND
  const [undepend, depend] = watch_factory(Writable, depended, [
    'dependencies',
    'undependency',
    'dependency'
  ]);

  // BRIDGE
  const [unbridge, bridge] = cross_factory(
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
  define('_', { value: _service_ }, 0);
  const define_services = definer(_service_);
  forIn({ [IS_STORE]: thisIsStore, updateVALUE }, (value, key) => {
    define_services(key, { get: () => value });
  });
  forIn(
    { subscribers, observables, observed, dependencies, depended },
    (value, key) => define_services(key, { get: () => [...value] })
  );

  // GET
  define('get', { value: () => VALUE }, 1);

  // SET
  define('set', { value: newVALUE => updateVALUE(newVALUE, -1) }, 1);
  define('setWeak', {
    value: (newVALUE, deep = 0) => updateVALUE(newVALUE, deep)
  }, 1);
  define('setSure', { value: newVALUE => updateVALUE(newVALUE, null) }, 1);

  // UPDATE
  define('update', { value: update => updateVALUE(update(VALUE), -1) }, 1);
  define('updateWeak', {
    value: (update, deep = 0) => updateVALUE(update(VALUE), deep)
  }, 1);
  define('updateSure', {
    value: update => updateVALUE(update(VALUE), null)
  }, 1);

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

  // GET AND SET VALUEUE
  [0, '$', 'value'].forEach(v => {
    define(v, {
      enumerable: !v,
      get: () => Writable.get(),
      set: newVALUE => Writable.set(newVALUE)
    });
  });

  // TYPE COERCION
  ['valueOf', 'toString', 'toJSON'].forEach(v => {
    define(v, {
      value: (...a) => (isVoid(VALUE) || !VALUE[v] ? VALUE : VALUE[v](...a))
    }, 1);
  });

  observe(_observed);
  depend(_depended);

  return Writable;
};
