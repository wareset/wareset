import {
  noop,
  setOwnProps,
  isArr,
  isVoid,
  isFunc,
  isPromise,
  // each,
  inArr
} from 'wareset-utilites';
import equal from './equal';

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
  value: Value;
  execute: SubscribeWrapper;
  unsubscribe: Unsubscriber;
};

const QUEUE: any = [];
let __GLOBAL_EXECUTING__: boolean;

const __QUEUER_START__ = (): void => {
  let sub;
  while (QUEUE.length) {
    if (__GLOBAL_EXECUTING__) break;
    sub = QUEUE.pop();
    if (sub.queue === QUEUE.length && !sub.executing && !sub.unsubscribed) {
      sub.execute();
    }
  }
};

const isStore = (v: any): boolean => v instanceof Store;
const checkInputs = (v: any): Store[] =>
  isStore(v) || !isArr(v) ? [v] : [...v];
class Store extends Array {
  // _!: __Service__;
  static isStore = isStore;
  isStore(v: any): boolean {
    return isStore(v);
  }

  #value: Value = undefined;
  0!: Value;
  $!: Value;
  value!: Value;
  get(): Value {
    return this.#value;
  }

  // [PREVIOUS_VALUE]!: Value;
  #previousValue: Value = undefined;
  get previousValue(): Value {
    return this.#previousValue;
  }

  // [PREVIOUS_DIFFERING_VALUE]!: Value;
  #previousDifferingValue: Value = undefined;
  get previousDifferingValue(): Value {
    return this.#previousDifferingValue;
  }

  #start: NotifierStart;
  #stop: NotifierStop = null;
  #subscribers: Subscriber[] = [];
  get subscribers(): Subscriber[] {
    return [...this.#subscribers];
  }

  get enabled(): boolean {
    return !!(this.#stop && this.#subscribers.length);
  }

  // [WATCH_LIST]!: Store[];
  #watchList: Store[] = [];
  get watchList(): Store[] {
    return [...this.#watchList];
  }
  get watchListValues(): Value[] {
    return this.#watchList.map((v) => (isStore(v) ? (v as Store).get() : v));
  }
  #watchableList: Store[] | _Choice_[] = [];
  get watchableList(): Store[] {
    return [...this.#watchableList];
  }

  // [REFER_LIST]!: Store[];
  #referList: Store[] = [];
  get referList(): Store[] {
    return [...this.#referList];
  }
  get referListValues(): Value[] {
    return this.#referList.map((v) => (isStore(v) ? (v as Store).get() : v));
  }
  #referenceList: Store[] | Deep[] = [];
  get referenceList(): Store[] {
    return [...(this.#referenceList as Store[])];
  }

  #initiator: Store | null = null;
  get initiator(): Store | null {
    return this.#initiator;
  }
  #initiatorType: string | null = null;
  get initiatorType(): string | null {
    return this.#initiatorType;
  }
  get initiatorTypeIsWatch(): boolean {
    return this.#initiatorType === 'watch';
  }
  get initiatorTypeIsRefer(): boolean {
    return this.#initiatorType === 'refer';
  }

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
      // _: { writable: 0, value: new __Service__(this, value, start) },
      0: { enumerable: 1, get: this.get, set: this.set }
    });

    this.set(value), (this.#start = start);
    this.refer(referList), this.watch(watchList);
    Object.seal(this);
  }

  #updating: boolean = false;
  get updating(): boolean {
    return this.#updating;
  }
  __update__(
    newValue: Value,
    deep: Deep,
    _choice_?: _Choice_,
    initiator: Store | null = null,
    initiatorType: string | null = null
  ): Store {
    if (initiatorType === 'watch' && newValue === null) newValue = this.#value;

    if (!equal(this.#value, newValue, deep)) {
      this.#updating = true;
      this.#previousValue = this.#value;
      if (!equal(this.#value, newValue, 0)) {
        this.#previousDifferingValue = this.#value;
      }
      this.#value = newValue;

      this.#initiator = initiator;
      this.#initiatorType = initiatorType;

      const referenceList = this.#referenceList;
      if ((!_choice_ || _choice_[2]) && referenceList.length) {
        for (let i = referenceList.length; (i -= 2) >= 0; undefined) {
          if (!(referenceList[i] as Store).updating) {
            // prettier-ignore
            (referenceList[i] as Store).__update__(this.#value,
              referenceList[i + 1] as Deep, [1, 1, 1], this, 'refer');
          }
        }
      }

      const watchableList = this.#watchableList;
      if ((!_choice_ || _choice_[1]) && watchableList.length) {
        for (let i = watchableList.length; (i -= 2) >= 0; undefined) {
          if (
            !watchableList[i].updating &&
            // prettier-ignore
            !equal(
              this.#value, this.#previousValue,
              watchableList[i + 1] as _Choice_)
          ) {
            // prettier-ignore
            (watchableList[i] as Store).__update__(null,
              null, [1], this, 'watch');
          }
        }
      }

      const subscribers = this.#subscribers;
      if ((!_choice_ || _choice_[0]) && this.#stop && subscribers.length) {
        for (let i = 0; i < subscribers.length; i++) {
          if (!subscribers[i].executing && !subscribers[i].unsubscribed) {
            subscribers[i].queue = QUEUE.length;
            subscribers[i].value = this.#value;
            QUEUE.push(subscribers[i]);
          }
        }
      }

      if (!_choice_) __QUEUER_START__();
      this.#updating = false;
    }

    return this;
  }

  subscribe(
    subscribe: SubscribeStart = noop,
    autorun: boolean = true
  ): Unsubscriber {
    const RUN = (cb: any, unsub?: Function): Function => {
      let res;
      if (!isFunc(unsub)) unsub = noop;
      if (isFunc(cb)) {
        res = cb.bind(this)(this.#value, this, unsub);
      } else if (isPromise(cb)) {
        res = cb.then((cb: Function) => RUN(this)(cb, unsub));
      }
      return res || noop;
    };

    let stop = noop;
    let executing = false;
    let unsubscribed = false;

    let initialized = false;

    const subscriber = {
      queue: -1,
      value: this.#value,
      get executing(): boolean {
        return executing;
      },
      get unsubscribed(): boolean {
        return unsubscribed;
      },
      execute: noop,
      unsubscribe: noop
    };

    const execute = (): SubscribeStop => {
      executing = true;

      __GLOBAL_EXECUTING__ = true;
      stop = subscribe.bind(this)(
        subscriber.value,
        this,
        subscriber.unsubscribe
      );
      __GLOBAL_EXECUTING__ = false;

      const afterExecuting = (): void => {
        executing = false;
        if (this.#subscribers[0] === subscriber) {
          (this.#initiator = null), (this.#initiatorType = null);
        }
      };

      if (!isPromise(stop)) afterExecuting();
      else (stop as any).finally(() => afterExecuting());

      __QUEUER_START__();
      return stop;
    };
    subscriber.execute = execute;

    const unsubscribe = (): Store => {
      unsubscribed = true;
      if (!initialized) initialized = true;
      else {
        const index = this.#subscribers.indexOf(subscriber);
        if (index !== -1) this.#subscribers.splice(index, 1);

        RUN(stop);
        if (!this.#subscribers.length) {
          RUN(this.#stop), (this.#stop = null);
        }
      }

      return this;
    };
    subscriber.unsubscribe = unsubscribe;

    this.#subscribers.unshift(subscriber);
    if (!this.#stop && this.#subscribers.length) {
      this.#stop = RUN(this.#start, unsubscribe);
    }
    if (autorun) execute();

    if (initialized) unsubscribe();
    initialized = true;
    return unsubscribe;
  }

  clearSubscribers(): this {
    while (this.#subscribers.length) {
      this.#subscribers[this.#subscribers.length - 1].unsubscribe();
    }
    return this;
  }

  setWeak(newValue: Value, deep: Deep = 0): this {
    this.__update__(newValue, deep);
    return this;
  }
  setSure(newValue: Value): this {
    return this.setWeak(newValue, null);
  }
  set(newValue: Value): this {
    return this.setWeak(newValue, -1);
  }

  updateWeak(update: Function, deep: Deep = 0): this {
    const newValue = update(this.#value, this, noop);
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
    this.__update__(this.#value, null);
    return this;
  }

  clearWatchList(): this {
    return this.watch([]);
  }
  clearWatchableList(): this {
    return this.watchable([]);
  }
  clearReferList(): this {
    return this.refer([]);
  }
  clearReferenceList(): this {
    return this.reference([]);
  }
  clearBridges(): this {
    this.#referList.forEach((v) => {
      if (inArr(this.#referenceList, v)) this.unrefer(v), this.unreference(v);
    });
    return this;
  }

  reset(): this {
    this.clearReferList(), this.clearReferenceList();
    this.clearWatchList(), this.clearWatchableList();
    this.clearSubscribers();
    return this;
  }
  clearAll(): this {
    return this.reset();
  }

  referenceWeak(store: Store | Store[], deep: Deep = 0): this {
    return this.#__watchable__(store, deep, [
      this.#referenceList as Store[],
      this.#referList,
      'reference',
      'refer',
      true,
      false
    ]);
  }
  referenceSure(store: Store | Store[]): this {
    return this.referenceWeak(store, null);
  }
  reference(store: Store | Store[]): this {
    return this.referenceWeak(store, -1);
  }
  watchableWeak(store: Store | Store[], deep: Deep = 0): this {
    return this.#__watchable__(store, deep, [
      this.#watchableList,
      this.#watchList,
      'watchable',
      'watch',
      false,
      [1]
    ]);
  }
  watchableSure(store: Store | Store[]): this {
    return this.watchableWeak(store, null);
  }
  watchable(store: Store | Store[]): this {
    return this.watchableWeak(store, -1);
  }
  #__watchable__ = (
    store: any,
    deep: any /* = -1 */,
    args: [Store[], Store[], string, string, boolean, any]
  ): any => {
    if (isStore(store)) {
      if (store !== this) {
        this.#__unwatchable__(store, args), args[0].push(store, deep);
        if (!inArr(args[1], this)) store[args[3]](this, deep);
        store.__update__((args[4] ? this : store).get(), deep, args[5]);
      }
    } else if (Array.isArray(store)) {
      this.#__unwatchable__(args[0], args);
      // if (args[0].length) return this.#__watchable__(store, deep, args);
      store.forEach((v) => this.#__watchable__(v, deep, args));
    }
    return self;
  };

  unreference(store: Store | Store[]): this {
    return this.#__unwatchable__(store, [
      this.#referenceList as Store[],
      this.#referList,
      'reference',
      'refer'
    ]);
  }
  unwatchable(store: Store | Store[]): this {
    return this.#__unwatchable__(store, [
      this.#watchableList,
      this.#watchList,
      'watchable',
      'watch'
    ]);
  }
  #__unwatchable__ = (
    store: any,
    args: [Store[], Store[], string, string, boolean?, any?]
  ): this => {
    if (isStore(store)) {
      const index = args[0].indexOf(store);
      if (index !== -1) {
        args[0].splice(index, 2);
        if (inArr(store[args[3] + 'List'], this)) store[args[2]](this);
      }
    } else if (Array.isArray(store)) {
      store.forEach((v) => this.#__unwatchable__(v, args));
    }
    return this;
  };

  referWeak(store: Store | Store[], deep: Deep = 0): this {
    return this.#__watch__(store, deep, [
      this.#referList,
      this.#referenceList as Store[],
      'reference'
    ]);
  }
  referSure(store: Store | Store[]): this {
    return this.referWeak(store, null);
  }
  refer(store: Store | Store[]): this {
    return this.referWeak(store, -1);
  }

  watchWeak(store: Store | Store[], deep: Deep = 0): this {
    return this.#__watch__(store, deep, [
      this.#watchList,
      this.#watchableList,
      'watchable'
    ]);
  }
  watchSure(store: Store | Store[]): this {
    return this.watchWeak(store, null);
  }
  watch(store: Store | Store[]): this {
    return this.watchWeak(store, -1);
  }
  #__watch__ = (
    store: any,
    deep: any /* = -1 */,
    args: [Store[], Store[], string]
  ): any => {
    if (isStore(store)) {
      if (store !== this) {
        this.#__unwatch__(store, args), args[0].push(store);
        if (!inArr(store[args[2] + 'List'], this)) {
          store[args[2]](this, deep);
        }
      }
    } else if (Array.isArray(store)) {
      this.#__unwatch__(args[0], args);
      // if (args[0].length) return this.#__watch__(store, deep, args);
      store.forEach((v) => this.#__watch__(v, deep, args));
    }
    return this;
  };

  unrefer(store: Store | Store[]): this {
    return this.#__unwatch__(store, [
      this.#referList,
      this.#referenceList as Store[],
      'reference'
    ]);
  }
  unwatch(store: Store | Store[]): this {
    return this.#__unwatch__(store, [
      this.#watchList,
      this.#watchableList,
      'watchable'
    ]);
  }
  #__unwatch__ = (
    store: Store | Store[],
    args: [Store[], Store[], string]
  ): any => {
    if (isStore(store)) {
      const index = args[0].indexOf(store as Store);
      if (index !== -1) {
        args[0].splice(index, 1);
        if (inArr(args[1], this)) store[('un' + args[2]) as any](this);
      }
    } else if (Array.isArray(store)) {
      store.forEach((v) => this.#__unwatch__(v, args));
    }
    return this;
  };

  bridgeWeak(store: Store | Store[], deep: Deep = 0): this {
    return this.#__cross__(store, deep, ['refer', 'reference', 'referWeak']);
  }
  bridgeSure(store: Store | Store[]): this {
    return this.bridgeWeak(store, null);
  }
  bridge(store: Store | Store[]): this {
    return this.bridgeWeak(store, -1);
  }
  #__cross__ = (
    store: any,
    deep: any /* = -1 */,
    args: [string, string, string]
  ): this => {
    if (isStore(store)) {
      if (store !== this) {
        this.#__uncross__(store, args);
        this[args[2] as any](store, deep), store[args[2]](this, deep);
      }
    } else if (Array.isArray(store)) {
      this[args[1] as any]([]), this[args[0] as any]([]);
      store.forEach((v) => this.#__cross__(v, deep, args));
    }
    return this;
  };

  unbridge(store: Store | Store[]): this {
    return this.#__uncross__(store, ['refer']);
  }
  #__uncross__ = (store: any, args: [string, string?, string?]): any => {
    if (isStore(store)) store[args[0]](this), this[args[0] as any](store);
    else if (Array.isArray(store)) {
      store.forEach((v) => this.#__uncross__(v, args));
    }
    return this;
  };

  valueOf!: () => Value;
  toString!: () => string;
  toJSON!: () => string;
}

const ownerizesStore = setOwnProps(Store.prototype);

// const OBSERVERS: any = {};
// const UNOBSERVE: any = {};

// // WATCH
// // prettier-ignore
// [UNOBSERVE[UNWATCH], OBSERVERS[WATCH]] = watchFactory(
//   [WATCH_LIST, WATCHABLE_LIST, UNWATCHABLE, WATCHABLE]);

// // WATCHABLE
// // prettier-ignore
// [UNOBSERVE[UNWATCHABLE], OBSERVERS[WATCHABLE]] = watchableFactory(
//   [WATCHABLE_LIST, WATCH_LIST, UNWATCH, WATCH, false, [1]], __UPDATE_VALUE__);

// // REFER
// // prettier-ignore
// [UNOBSERVE[UNREFER], OBSERVERS[REFER]] = watchFactory(
//   [REFER_LIST, REFERENCE_LIST, UNREFERENCE, REFERENCE]);

// // REFERENCE
// // prettier-ignore
// [UNOBSERVE[UNREFERENCE], OBSERVERS[REFERENCE]] = watchableFactory(
//   [REFERENCE_LIST, REFER_LIST, UNREFER, REFER, true, false], __UPDATE_VALUE__);

// // BRIDGE
// // prettier-ignore
// [UNOBSERVE[UNBRIDGE], OBSERVERS[BRIDGE]] = crossFactory(
//   [REFERENCE, UNREFER, REFER]);

// each(OBSERVERS, (v: Function, k: string) => {
//   ownerizesStore({
//     [k + 'Weak']: function (store: Store | Store[], deep: Deep = 0): Store {
//       return v(this, store, deep);
//     },
//     [k + 'Sure']: function (store: Store | Store[]): Store {
//       return v(this, store, null);
//     },
//     [k]: function (store: Store | Store[]): Store {
//       return v(this, store, -1);
//     }
//   });
// });

// each(UNOBSERVE, (v: Function, k: string) => {
//   ownerizesStore({
//     [k]: function (store: Store | Store[]): Store {
//       return v(this, store);
//     }
//   });
// });

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
