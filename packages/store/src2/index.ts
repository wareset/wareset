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
  WATCH_LIST,
  REFER_LIST,
  WATCHABLE_LIST,
  REFERENCE_LIST,
  WATCH,
  UNWATCH,
  WATCHABLE,
  UNWATCHABLE,
  REFER,
  UNREFER,
  REFERENCE,
  UNREFERENCE,
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

type Subscriber = {
  queue: number;
  executing: boolean;
  unsubscribed: boolean;
  execute: SubscribeWrapper;
  value: Value;
  unsubscribe: Unsubscriber;
};

const QUEUE: any = [];
let __GLOBAL_EXECUTING__: boolean;

const VALUE = 'value';
const PREVIOUS_VALUE = 'previousValue';
const PREVIOUS_DIFFERING_VALUE = 'previousDifferingValue';

const STOP = '__stop__';
const START = '__start__';

const WATCH_LIST_VALUES = 'watchListValues';
const REFER_LIST_VALUES = 'referListValues';

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

const __RUN__ = (self: Store) => (cb: any, unsub?: Function): Function => {
  let res;
  if (!isFunc(unsub)) unsub = noop;
  if (isFunc(cb)) {
    res = cb.bind(self)(self[VALUE], self, unsub);
  } else if (isPromise(cb)) {
    res = cb.then((cb: Function) => __RUN__(self)(cb, unsub));
  }
  return res || noop;
};

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

  [WATCH_LIST]: Store[] = [];
  [REFER_LIST]: Store[] = [];
  [WATCHABLE_LIST]: Store[] | _Choice_[] = [];
  [REFERENCE_LIST]: Store[] | Deep[] = [];

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
    return this[INITIATOR_TYPE] === WATCH_LIST;
  }
  get initiatorTypeIsDepended(): boolean {
    return this[INITIATOR_TYPE] === REFER_LIST;
  }

  get [WATCH_LIST_VALUES](): Value[] {
    return this[WATCH_LIST].map((v) => (isStore(v) ? (v as Store).get() : v));
  }

  get [REFER_LIST_VALUES](): Value[] {
    return this[REFER_LIST].map((v) => (isStore(v) ? (v as Store).get() : v));
  }

  [__QUEUER_START__](): void {
    let sub;
    while (QUEUE.length) {
      if (__GLOBAL_EXECUTING__) break;
      sub = QUEUE.pop();
      if (sub.queue === QUEUE.length && !sub.executing && !sub.unsubscribed) {
        sub.execute();
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

      const referenceList = this[REFERENCE_LIST];
      if ((!_choice_ || _choice_[2]) && referenceList.length) {
        for (let i = referenceList.length; (i -= 2) >= 0; undefined) {
          if (!(referenceList[i] as Store)._[__UPDATING__]) {
            (referenceList[i] as Store)._[INITIATOR] = this[__PARENT__];
            (referenceList[i] as Store)._[INITIATOR_TYPE] = REFER_LIST;
            // prettier-ignore
            (referenceList[i] as Store)._[__UPDATE_VALUE__](
              this[VALUE], referenceList[i + 1] as Deep, [1, 1, 1]);
          }
        }
      }

      const watchableList = this[WATCHABLE_LIST];
      if ((!_choice_ || _choice_[1]) && watchableList.length) {
        for (let i = watchableList.length; (i -= 2) >= 0; undefined) {
          if (
            !watchableList[i]._[__UPDATING__] &&
            // prettier-ignore
            !equal(
              this[VALUE], this[PREVIOUS_VALUE],
                watchableList[i + 1] as _Choice_)
          ) {
            (watchableList[i] as Store)._[INITIATOR] = this[__PARENT__];
            (watchableList[i] as Store)._[INITIATOR_TYPE] = WATCH_LIST;
            // prettier-ignore
            (watchableList[i] as Store)._[__UPDATE_VALUE__](
              (watchableList[i] as Store)._[VALUE], null, [1]);
          }
        }
      }

      const subscribers = this.subscribers;
      if ((!_choice_ || _choice_[0]) && this[STOP] && subscribers.length) {
        for (let i = 0; i < subscribers.length; i++) {
          if (!subscribers[i].executing && !subscribers[i].unsubscribed) {
            subscribers[i].queue = QUEUE.length;
            subscribers[i].value = this[VALUE];
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
    const service = this;
    const parent = service[__PARENT__];
    const RUN = __RUN__(parent);

    let stop = noop;
    let executing = false;
    let unsubscribed = false;

    let initialized = false;

    const subscriber = {
      queue: -1,
      value: this[VALUE],
      get executing(): boolean {
        return executing;
      },
      get unsubscribed(): boolean {
        return unsubscribed;
      },

      execute,
      unsubscribe
    };

    function execute(): SubscribeStop {
      executing = true;

      __GLOBAL_EXECUTING__ = true;
      stop = subscribe.bind(parent)(subscriber.value, parent, unsubscribe);
      __GLOBAL_EXECUTING__ = false;

      const afterExecuting = (): void => {
        executing = false;
        if (service.subscribers[0] === subscriber) {
          (service[INITIATOR] = null), (service[INITIATOR_TYPE] = null);
        }
      };

      if (!isPromise(stop)) afterExecuting();
      else (stop as any).finally(() => afterExecuting());

      service[__QUEUER_START__]();
      return stop;
    }

    function unsubscribe(): Store {
      unsubscribed = true;
      if (!initialized) initialized = true;
      else {
        const index = service.subscribers.indexOf(subscriber);
        if (index !== -1) service.subscribers.splice(index, 1);

        RUN(stop);
        if (!service.subscribers.length) {
          RUN(service[STOP]), (service[STOP] = null);
        }
      }

      return parent;
    }

    this.subscribers.unshift(subscriber);
    if (!this[STOP] && this.subscribers.length) {
      this[STOP] = RUN(this[START], unsubscribe);
    }
    if (autorun) execute();

    if (initialized) unsubscribe();
    initialized = true;
    return unsubscribe;
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
  [WATCH_LIST]!: Store[];
  [REFER_LIST]!: Store[];
  [WATCH_LIST_VALUES]!: Value[];
  [REFER_LIST_VALUES]!: Value[];

  constructor(value?: Value);
  constructor(value: Value, watchListOrStart: Store | Store[] | NotifierStart);
  constructor(
    value: Value,
    watchList: Store | Store[],
    referListOrStart: Store | Store[] | NotifierStart
  );
  constructor(
    value: Value,
    watchList: Store | Store[],
    referList: Store | Store[],
    start: NotifierStart
  );
  constructor(
    value: Value,
    watchList: Store | Store[] = [],
    referList: Store | Store[] = [],
    start: NotifierStart | any = noop
  ) {
    super();
    if (isFunc(watchList)) (start = watchList), (watchList = []);
    if (isFunc(referList)) (start = referList), (referList = []);
    if (!isFunc(start)) start = noop;

    (watchList = checkInputs(watchList)), (referList = checkInputs(referList));
    setOwnProps(this, {
      _: { writable: 0, value: new __Service__(this, value, start) },
      0: { enumerable: 1, get: this.get, set: this.set }
    });

    this.refer(referList), this.watch(watchList);
    Object.seal(this);
  }

  subscribe(subscribe = noop, autorun = true): Unsubscriber {
    return this._.subscribe(subscribe, autorun);
  }
  clearSubscribers(): this {
    while (this._.subscribers.length) {
      this._.subscribers[this._.subscribers.length - 1].unsubscribe();
    }
    return this;
  }
  // on(subscribe = noop, autorun = true): this {
  //   this.subscribe(subscribe, autorun);
  //   return this;
  // }

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
    const newValue = update(this._[VALUE], this, noop);
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
    return this.watch([]);
  }
  clearObservables(): this {
    return this.watchable([]);
  }
  clearDepended(): this {
    return this.refer([]);
  }
  clearDependencies(): this {
    return this.reference([]);
  }
  clearBridges(): this {
    [...this._[REFER_LIST]].forEach((v) => {
      if (inArr(this._[REFERENCE_LIST], v)) {
        this.unrefer(v), this.unreference(v);
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

  watchWeak!: (store: Store | Store[], deep?: Deep) => this;
  watchableWeak!: (store: Store | Store[], deep?: Deep) => this;
  referWeak!: (store: Store | Store[], deep?: Deep) => this;
  referenceWeak!: (store: Store | Store[], deep?: Deep) => this;
  bridgeWeak!: (store: Store | Store[], deep?: Deep) => this;

  watchSure!: (store: Store | Store[]) => this;
  watchableSure!: (store: Store | Store[]) => this;
  referSure!: (store: Store | Store[]) => this;
  referenceSure!: (store: Store | Store[]) => this;
  bridgeSure!: (store: Store | Store[]) => this;

  watch!: (store: Store | Store[]) => this;
  watchable!: (store: Store | Store[]) => this;
  refer!: (store: Store | Store[]) => this;
  reference!: (store: Store | Store[]) => this;
  bridge!: (store: Store | Store[]) => this;

  unwatch!: (store: Store | Store[]) => this;
  unwatchable!: (store: Store | Store[]) => this;
  unrefer!: (store: Store | Store[]) => this;
  unreference!: (store: Store | Store[]) => this;
  unbridge!: (store: Store | Store[]) => this;

  valueOf!: () => Value;
  toString!: () => string;
  toJSON!: () => string;
}

const ownerizesStore = setOwnProps(Store.prototype);

const OBSERVERS: any = {};
const UNOBSERVE: any = {};

// WATCH
// prettier-ignore
[UNOBSERVE[UNWATCH], OBSERVERS[WATCH]] = watchFactory(
  [WATCH_LIST, WATCHABLE_LIST, UNWATCHABLE, WATCHABLE]);

// WATCHABLE
// prettier-ignore
[UNOBSERVE[UNWATCHABLE], OBSERVERS[WATCHABLE]] = watchableFactory(
  [WATCHABLE_LIST, WATCH_LIST, UNWATCH, WATCH, false, [1]], __UPDATE_VALUE__);

// REFER
// prettier-ignore
[UNOBSERVE[UNREFER], OBSERVERS[REFER]] = watchFactory(
  [REFER_LIST, REFERENCE_LIST, UNREFERENCE, REFERENCE]);

// REFERENCE
// prettier-ignore
[UNOBSERVE[UNREFERENCE], OBSERVERS[REFERENCE]] = watchableFactory(
  [REFERENCE_LIST, REFER_LIST, UNREFER, REFER, true, false], __UPDATE_VALUE__);

// BRIDGE
// prettier-ignore
[UNOBSERVE[UNBRIDGE], OBSERVERS[BRIDGE]] = crossFactory(
  [REFERENCE, UNREFER, REFER]);

each(OBSERVERS, (v: Function, k: string) => {
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

each(UNOBSERVE, (v: Function, k: string) => {
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
  [WATCH_LIST]: {
    get: function (): Value {
      return [...(this as Store)._[WATCH_LIST]];
    }
  },
  [REFER_LIST]: {
    get: function (): Value {
      return [...(this as Store)._[REFER_LIST]];
    }
  },
  [WATCH_LIST_VALUES]: {
    get: function (): Value {
      return (this as Store)._[WATCH_LIST_VALUES];
    }
  },
  [REFER_LIST_VALUES]: {
    get: function (): Value {
      return (this as Store)._[REFER_LIST_VALUES];
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
  watchListOrStart: Store | Store[] | NotifierStart
): Store;
// eslint-disable-next-line no-redeclare
function store(
  value: Value,
  watchList: Store | Store[],
  referListOrStart: Store | Store[] | NotifierStart
): Store;
// eslint-disable-next-line no-redeclare
function store(
  value: Value,
  watchList: Store | Store[],
  referList: Store | Store[],
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
