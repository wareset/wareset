import {
  noop,
  setOwnProps,
  isArr,
  isVoid,
  isFunc,
  isPromise,
  each,
  inArr
} from 'wareset-utilites';
import equal from './equal';
import { watchableFactory, watchFactory, crossFactory } from './methods';

import {
  OBSERVED,
  DEPENDED,
  OBSERVABLES,
  DEPENDENCIES,
  OBSERVE,
  UNOBSERVE,
  OBSERVABLE,
  UNOBSERVABLE,
  DEPEND,
  UNDEPEND,
  DEPENDENCY,
  UNDEPENDENCY,
  BRIDGE,
  UNBRIDGE
} from './consts';

// export const Store = ((): any => {
type Value = any;
type Deep = number | boolean | null;
type _Choice_ = any;

type SubscribeStart = Function;
type SubscribeStop = Function | any;

type Unsubscriber = Function;

type NotifierStart = Function | void;
type NotifierStop = Function | null;

type SubscribeWrapper = Function;
type Subscriber = [
  number,
  boolean,
  boolean,
  SubscribeWrapper,
  Value,
  Value[],
  Store,
  Unsubscriber,
  SubscribeStop?
];

const QUEUE: any = [];
let __GLOBAL_EXECUTING__: boolean;

const VALUE = 'value';
const PREVIOUS_VALUE = 'previousValue';
const PREVIOUS_DIFFERING_VALUE = 'previousDifferingValue';

const STOP = '__stop__';
const START = '__start__';

const OBSERVED_VALUES = 'observedValues';
const DEPENDED_VALUES = 'dependedValues';

const __QUEUER_START__ = '__queuer_start__';
const __UPDATE_VALUE__ = '__update_value__';

const __PARENT__ = '__self__';
const __ENABLED__ = '__enabled__';
const __UPDATING__ = '__updating__';

const INITIATOR = 'initiator';
const INITIATOR_TYPE = 'initiatorType';

const isStore = (v: any): boolean => v instanceof Store;
const checkInputs = (v: any): Store[] =>
  isStore(v) || !isArr(v) ? [v] : [...v];

class __Service__ {
  isStore = isStore;
  [VALUE]: Value;
  [PREVIOUS_VALUE]: any = undefined;
  [PREVIOUS_DIFFERING_VALUE]: any = undefined;
  [__PARENT__]: Store;

  [START]: NotifierStart;
  [STOP]: NotifierStop = null;
  subscribers: Subscriber[] = [];
  [__UPDATING__] = false;

  [OBSERVED]: Store[] = [];
  [DEPENDED]: Store[] = [];
  [OBSERVABLES]: Store[] | _Choice_[] = [];
  [DEPENDENCIES]: Store[] | Deep[] = [];

  [INITIATOR]: Store | null = null;
  [INITIATOR_TYPE]: string | null = null;

  constructor(parent: Store, value: Value, start: NotifierStart) {
    (this[__PARENT__] = parent), (this[VALUE] = value), (this[START] = start);
    Object.seal(this);
  }

  get [__ENABLED__](): boolean {
    return !!(this[STOP] && this.subscribers.length);
  }

  get initiatorTypeIsObserved(): boolean {
    return this[INITIATOR_TYPE] === OBSERVED;
  }
  get initiatorTypeIsDepended(): boolean {
    return this[INITIATOR_TYPE] === DEPENDED;
  }

  get [OBSERVED_VALUES](): Value[] {
    return this[OBSERVED].map((v) => (isStore(v) ? (v as Store).get() : v));
  }

  get [DEPENDED_VALUES](): Value[] {
    return this[DEPENDED].map((v) => (isStore(v) ? (v as Store).get() : v));
  }

  [__QUEUER_START__](): void {
    let sub;
    while (QUEUE.length) {
      if (__GLOBAL_EXECUTING__) break;
      sub = QUEUE.pop();
      if (!(sub[1] || sub[2] || sub[0] !== QUEUE.length)) {
        sub[3](sub[4], sub[5], sub[6], sub[7]);
      }
    }
  }

  [__UPDATE_VALUE__](newValue: Value, deep: Deep, _choice_?: _Choice_): Store {
    if (!equal(this[VALUE], newValue, deep)) {
      this[__UPDATING__] = true;
      this[PREVIOUS_VALUE] = this[VALUE];
      if (!equal(this[VALUE], newValue, 0)) {
        this[PREVIOUS_DIFFERING_VALUE] = this[VALUE];
      }
      this[VALUE] = newValue;

      const dependencies = this[DEPENDENCIES];
      if ((!_choice_ || _choice_[2]) && dependencies.length) {
        for (let i = dependencies.length; (i -= 2) >= 0; undefined) {
          if (!(dependencies[i] as Store)._[__UPDATING__]) {
            (dependencies[i] as Store)._[INITIATOR] = this[__PARENT__];
            (dependencies[i] as Store)._[INITIATOR_TYPE] = DEPENDED;
            // prettier-ignore
            (dependencies[i] as Store)._[__UPDATE_VALUE__](
              this[VALUE], dependencies[i + 1] as Deep, [1, 1, 1]);
          }
        }
      }

      const observables = this[OBSERVABLES];
      if ((!_choice_ || _choice_[1]) && observables.length) {
        for (let i = observables.length; (i -= 2) >= 0; undefined) {
          if (
            !observables[i]._[__UPDATING__] &&
            // prettier-ignore
            !equal(
              this[VALUE], this[PREVIOUS_VALUE],
                observables[i + 1] as _Choice_)
          ) {
            (observables[i] as Store)._[INITIATOR] = this[__PARENT__];
            (observables[i] as Store)._[INITIATOR_TYPE] = OBSERVED;
            // prettier-ignore
            (observables[i] as Store)._[__UPDATE_VALUE__](
              (observables[i] as Store)._[VALUE], null, [1]);
          }
        }
      }

      const subscribers = this.subscribers;
      if ((!_choice_ || _choice_[0]) && this[STOP] && subscribers.length) {
        const observedValues = this[OBSERVED_VALUES];
        // for (let i = subscribers.length; i-- > 0; undefined) {
        for (let i = 0; i < subscribers.length; i++) {
          if (!subscribers[i][1]) {
            subscribers[i][0] = QUEUE.length;
            subscribers[i][4] = this[VALUE];
            subscribers[i][5] = observedValues;
            QUEUE.push(subscribers[i]);
          }
        }
      }

      if (!_choice_) this[__QUEUER_START__]();
      this[__UPDATING__] = false;
    }

    return this[__PARENT__];
  }

  subscribe(
    subscribe: SubscribeStart = noop,
    autorun: boolean = true
  ): Unsubscriber {
    // eslint-disable-next-line prefer-const
    let subscriber: Subscriber;

    const sub: SubscribeWrapper = (...a: any[]): SubscribeStop => {
      subscriber[1] = true;

      __GLOBAL_EXECUTING__ = true;
      subscriber[8] = subscribe.bind(this[__PARENT__])(...a);
      __GLOBAL_EXECUTING__ = false;

      const afterExecuting = (): void => {
        subscriber[1] = false;
        if (this.subscribers[0] === subscriber) {
          (this[INITIATOR] = null), (this[INITIATOR_TYPE] = null);
        }
      };

      if (!isPromise(subscriber[8])) afterExecuting();
      else subscriber[8].finally(() => afterExecuting());

      this[__QUEUER_START__]();
      return subscriber[8];
    };

    const RUN = (cb: any, unsub?: Function): Function => {
      let res;
      if (!isFunc(unsub)) unsub = noop;
      if (isFunc(cb)) {
        res = cb.bind(this[__PARENT__])(
          this[VALUE],
          this[OBSERVED_VALUES],
          this[__PARENT__],
          unsub
        );
      } else if (isPromise(cb)) {
        res = cb.then((cb: Function) => RUN(cb, unsub));
      }
      return res || noop;
    };

    let initialized = false;
    const unsub: Unsubscriber = (): Store => {
      subscriber[2] = true;
      if (!initialized) initialized = true;
      else {
        const index = this.subscribers.indexOf(subscriber);
        if (index !== -1) this.subscribers.splice(index, 1);

        RUN(subscriber[8]);
        if (!this.subscribers.length) RUN(this[STOP]), (this[STOP] = null);
      }

      return this[__PARENT__];
    };

    subscriber = [-1, !1, !1, sub, this[VALUE], [], this[__PARENT__], unsub];
    this.subscribers.unshift(subscriber);

    if (!this[STOP] && this.subscribers.length) {
      this[STOP] = RUN(this[START], unsub);
    }
    if (autorun) subscriber[8] = RUN(sub, unsub);

    if (initialized) unsub();
    initialized = true;
    return unsub;
  }
}

class Store extends Array {
  _!: __Service__;
  static isStore = isStore;
  isStore(v: any): boolean {
    return isStore(v);
  }

  0!: Value;
  $!: Value;
  value!: Value;
  [PREVIOUS_VALUE]!: Value;
  [PREVIOUS_DIFFERING_VALUE]!: Value;
  [OBSERVED]!: Store[];
  [DEPENDED]!: Store[];
  [OBSERVED_VALUES]!: Value[];
  [DEPENDED_VALUES]!: Value[];

  constructor(value?: Value);
  constructor(value: Value, observedOrStart: Store | Store[] | NotifierStart);
  constructor(
    value: Value,
    observed: Store | Store[],
    dependedOrStart: Store | Store[] | NotifierStart
  );
  constructor(
    value: Value,
    observed: Store | Store[],
    depended: Store | Store[],
    start: NotifierStart
  );
  constructor(
    value: Value,
    observed: Store | Store[] = [],
    depended: Store | Store[] = [],
    start: NotifierStart | any = noop
  ) {
    super();
    if (isFunc(observed)) (start = observed), (observed = []);
    if (isFunc(depended)) (start = depended), (depended = []);
    if (!isFunc(start)) start = noop;

    (observed = checkInputs(observed)), (depended = checkInputs(depended));
    setOwnProps(this, {
      _: { writable: 0, value: new __Service__(this, value, start) },
      0: { enumerable: 1, get: this.get, set: this.set }
    });

    this.depend(depended), this.observe(observed);
  }

  subscribe(subscribe = noop, autorun = true): Unsubscriber {
    return this._.subscribe(subscribe, autorun);
  }
  clearSubscribers(): this {
    while (this._.subscribers.length) this._.subscribers[0][7]();
    return this;
  }
  on(subscribe = noop, autorun = true): this {
    this.subscribe(subscribe, autorun);
    return this;
  }

  // getPreviousDiffering(): Value {
  //   return this._[PREVIOUS_DIFFERING_VALUE];
  // }
  // getPrevious(): Value {
  //   return this._[PREVIOUS_VALUE];
  // }
  get(): Value {
    return this._[VALUE];
  }

  setWeak(newValue: Value, deep: Deep = 0): this {
    this._[__UPDATE_VALUE__](newValue, deep);
    return this;
  }
  setSure(newValue: Value): this {
    return this.setWeak(newValue, null);
  }
  set(newValue: Value): this {
    return this.setWeak(newValue, -1);
  }

  updateWeak(update: Function, deep: Deep = 0): this {
    const newValue = update(this._[VALUE], this._[OBSERVED_VALUES], this, noop);
    if (!isPromise(newValue)) this.setWeak(newValue, deep);
    else newValue.then((value: Value) => this.setWeak(value, deep));
    return this;
  }
  updateSure(update: Function): this {
    return this.updateWeak(update, null);
  }
  update(update: Function): this {
    return this.updateWeak(update, -1);
  }

  next(newValue: Value, deep = -1): this {
    return this.setWeak(newValue, deep);
  }
  forceUpdate(): this {
    this._[__UPDATE_VALUE__](this._[VALUE], null);
    return this;
  }

  clearObserved(): this {
    return this.observe([]);
  }
  clearObservables(): this {
    return this.observable([]);
  }
  clearDepended(): this {
    return this.depend([]);
  }
  clearDependencies(): this {
    return this.dependency([]);
  }
  clearBridges(): this {
    [...this._[DEPENDED]].forEach((v) => {
      if (inArr(this._[DEPENDENCIES], v)) {
        this.undepend(v), this.undependency(v);
      }
    });
    return this;
  }

  reset(): this {
    this.clearDepended(), this.clearDependencies();
    this.clearObserved(), this.clearObservables();
    this.clearSubscribers();
    return this;
  }
  clearAll(): this {
    return this.reset();
  }

  observeWeak!: (store: Store | Store[], deep?: Deep) => this;
  observableWeak!: (store: Store | Store[], deep?: Deep) => this;
  dependWeak!: (store: Store | Store[], deep?: Deep) => this;
  dependencyWeak!: (store: Store | Store[], deep?: Deep) => this;
  bridgeWeak!: (store: Store | Store[], deep?: Deep) => this;

  observeSure!: (store: Store | Store[]) => this;
  observableSure!: (store: Store | Store[]) => this;
  dependSure!: (store: Store | Store[]) => this;
  dependencySure!: (store: Store | Store[]) => this;
  bridgeSure!: (store: Store | Store[]) => this;

  observe!: (store: Store | Store[]) => this;
  observable!: (store: Store | Store[]) => this;
  depend!: (store: Store | Store[]) => this;
  dependency!: (store: Store | Store[]) => this;
  bridge!: (store: Store | Store[]) => this;

  unobserve!: (store: Store | Store[]) => this;
  unobservable!: (store: Store | Store[]) => this;
  undepend!: (store: Store | Store[]) => this;
  undependency!: (store: Store | Store[]) => this;
  unbridge!: (store: Store | Store[]) => this;

  valueOf!: () => Value;
  toString!: () => string;
  toJSON!: () => string;
}

const ownerizesStore = setOwnProps(Store.prototype);

const WATCHES: any = {};
const UNWATCH: any = {};

// OBSERVE
// prettier-ignore
[UNWATCH[UNOBSERVE], WATCHES[OBSERVE]] = watchFactory(
  [OBSERVED, OBSERVABLES, UNOBSERVABLE, OBSERVABLE]);

// OBSERVABLE
// prettier-ignore
[UNWATCH[UNOBSERVABLE], WATCHES[OBSERVABLE]] = watchableFactory(
  [OBSERVABLES, OBSERVED, UNOBSERVE, OBSERVE, false, [1]], __UPDATE_VALUE__);

// DEPEND
// prettier-ignore
[UNWATCH[UNDEPEND], WATCHES[DEPEND]] = watchFactory(
  [DEPENDED, DEPENDENCIES, UNDEPENDENCY, DEPENDENCY]);

// DEPENDENCY
// prettier-ignore
[UNWATCH[UNDEPENDENCY], WATCHES[DEPENDENCY]] = watchableFactory(
  [DEPENDENCIES, DEPENDED, UNDEPEND, DEPEND, true, false], __UPDATE_VALUE__);

// BRIDGE
// prettier-ignore
[UNWATCH[UNBRIDGE], WATCHES[BRIDGE]] = crossFactory(
  [DEPENDENCY, UNDEPEND, DEPEND]);

each(WATCHES, (v: Function, k: string) => {
  ownerizesStore({
    [k + 'Weak']: function (store: Store | Store[], deep: Deep = 0): Store {
      return v(this, store, deep);
    },
    [k + 'Sure']: function (store: Store | Store[]): Store {
      return v(this, store, null);
    },
    [k]: function (store: Store | Store[]): Store {
      return v(this, store, -1);
    }
  });
});

each(UNWATCH, (v: Function, k: string) => {
  ownerizesStore({
    [k]: function (store: Store | Store[]): Store {
      return v(this, store);
    }
  });
});

// GET AND SET VALUE
['$', 'value'].forEach((v) => {
  ownerizesStore({
    [v]: {
      get: function (): any {
        return this.get();
      },
      set: function (newValue: any): void {
        this.set(newValue);
      }
    }
  });
});

ownerizesStore({
  [PREVIOUS_VALUE]: {
    get: function (): Value {
      return (this as Store)._[PREVIOUS_VALUE];
    }
  },
  [PREVIOUS_DIFFERING_VALUE]: {
    get: function (): Value {
      return (this as Store)._[PREVIOUS_DIFFERING_VALUE];
    }
  },
  // on: {
  //   get: function (): Function {
  //     return (this as Store).subscribe;
  //   }
  // },
  [OBSERVED]: {
    get: function (): Value {
      return [...(this as Store)._[OBSERVED]];
    }
  },
  [DEPENDED]: {
    get: function (): Value {
      return [...(this as Store)._[DEPENDED]];
    }
  },
  [OBSERVED_VALUES]: {
    get: function (): Value {
      return (this as Store)._[OBSERVED_VALUES];
    }
  },
  [DEPENDED_VALUES]: {
    get: function (): Value {
      return (this as Store)._[DEPENDED_VALUES];
    }
  }
});

// TYPE COERCION
['valueOf', 'toString', 'toJSON'].forEach((v) => {
  ownerizesStore({
    [v]: function () {
      const value = this.get();
      return isVoid(value) || !value[v] ? value : value[v]();
    }
  });
});

// eslint-disable-next-line no-redeclare
function store(value: Value): Store;
// eslint-disable-next-line no-redeclare
function store(
  value: Value,
  observedOrStart: Store | Store[] | NotifierStart
): Store;
// eslint-disable-next-line no-redeclare
function store(
  value: Value,
  observed: Store | Store[],
  dependedOrStart: Store | Store[] | NotifierStart
): Store;
// eslint-disable-next-line no-redeclare
function store(
  value: Value,
  observed: Store | Store[],
  depended: Store | Store[],
  start: NotifierStart
): Store;
// eslint-disable-next-line no-redeclare
function store(...a: any[]): Store {
  return new Store(...a);
}
store.isStore = isStore;

// return __Store__;
// })();

export { store, Store, isStore };
export default store;
