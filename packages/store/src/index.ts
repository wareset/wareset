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

const freeze = (v: any): any => Object.freeze([...v]);

type Service = {
  value: Value;

  previousValue: Value;
  previousDifferingValue: Value;

  start: NotifierStart;
  stop: NotifierStop;
  subscribers: Subscriber[];

  watchList: Store[];
  watchableList: Store[] | _Choice_[];

  referList: Store[];
  referenceList: Store[] | Deep[];

  initiator: Store | null;
  initiatorType: string | null;

  updating: boolean;
};

const __unwatchable__ = (
  self: Store,
  store: Store | Store[] | any,
  args: [Store[], Store[], string, string, boolean?, any?]
): Store => {
  if (isStore(store)) {
    const index = args[0].indexOf(store);
    if (index !== -1) {
      args[0].splice(index, 2);
      if (inArr(store[args[3] + 'List'], self)) store[args[2]](self);
    }
  } else if (Array.isArray(store)) {
    store.forEach((v) => __unwatchable__(self, v, args));
  }
  return self;
};
const __watchable__ = (
  self: Store,
  store: Store | Store[] | any,
  deep: any /* = -1 */,
  args: [Store[], Store[], string, string, boolean, any]
): Store => {
  if (isStore(store)) {
    if (store !== this) {
      __unwatchable__(self, store, args), args[0].push(store, deep);
      if (!inArr(args[1], self)) store[args[3]](self, deep);
      store.__update__((args[4] ? self : store).get(), deep, args[5]);
      // store.setWeak((args[4] ? this : store).get(), deep);
    }
  } else if (Array.isArray(store)) {
    __unwatchable__(self, args[0], args);
    // if (args[0].length) return this.#__watchable__(store, deep, args);
    store.forEach((v) => __watchable__(self, v, deep, args));
  }
  return self;
};

const __unwatch__ = (
  self: Store,
  store: Store | Store[] | any,
  args: [Store[], Store[], string]
): Store => {
  if (isStore(store)) {
    const index = args[0].indexOf(store as Store);
    if (index !== -1) {
      args[0].splice(index, 1);
      if (inArr(args[1], self)) store['un' + args[2]](self);
    }
  } else if (Array.isArray(store)) {
    store.forEach((v) => __unwatch__(self, v, args));
  }
  return self;
};
const __watch__ = (
  self: Store,
  store: Store | Store[] | any,
  deep: any /* = -1 */,
  args: [Store[], Store[], string]
): Store => {
  if (isStore(store)) {
    if (store !== self) {
      __unwatch__(self, store, args), args[0].push(store);
      if (!inArr(store[args[2] + 'List'], self)) {
        store[args[2]](self, deep);
      }
    }
  } else if (Array.isArray(store)) {
    __unwatch__(self, args[0], args);
    // if (args[0].length) return this.#__watch__(store, deep, args);
    store.forEach((v) => __watch__(self, v, deep, args));
  }
  return self;
};

const __uncross__ = (
  self: Store,
  store: Store | Store[] | any,
  args: [string, string?, string?]
): Store => {
  if (isStore(store)) store[args[0]](self), self[args[0] as any](store);
  else if (Array.isArray(store)) {
    store.forEach((v) => __uncross__(self, v, args));
  }
  return self;
};
const __cross__ = (
  self: Store,
  store: Store | Store[] | any,
  deep: any /* = -1 */,
  args: [string, string, string]
): Store => {
  if (isStore(store)) {
    if (store !== self) {
      __uncross__(self, store, args);
      self[args[2] as any](store, deep), store[args[2]](self, deep);
    }
  } else if (Array.isArray(store)) {
    self[args[1] as any]([]), self[args[0] as any]([]);
    store.forEach((v) => __cross__(self, v, deep, args));
  }
  return self;
};

const __CACHE__: WeakMap<Store, Service> = new WeakMap();
const _ = (v: Store): Service => __CACHE__.get(v) as Service;
class Store extends Array {
  // _!: __Service__;
  static isStore = isStore;
  public isStore(v: any): boolean {
    return isStore(v);
  }

  public 0!: Value;
  public $!: Value;
  public value!: Value;

  // [PREVIOUS_VALUE]!: Value;
  public get previousValue(): Value {
    return _(this).previousValue;
  }

  // [PREVIOUS_DIFFERING_VALUE]!: Value;
  public get previousDifferingValue(): Value {
    return _(this).previousDifferingValue;
  }

  public get start(): NotifierStart {
    return _(this).start;
  }
  public get stop(): NotifierStop {
    return _(this).stop;
  }
  public get subscribers(): Subscriber[] {
    return freeze(_(this).subscribers);
  }

  public get enabled(): boolean {
    const service = _(this);
    return !!(service.stop && service.subscribers.length);
  }

  // [WATCH_LIST]!: Store[];
  public get watchList(): Store[] {
    return freeze(_(this).watchList);
  }
  public get watchListValues(): Value[] {
    return _(this).watchList.map((v) => (isStore(v) ? (v as Store).get() : v));
  }
  public get watchableList(): Store[] {
    return freeze(_(this).watchableList);
  }

  // [REFER_LIST]!: Store[];
  public get referList(): Store[] {
    return freeze(_(this).referList);
  }
  public get referListValues(): Value[] {
    return _(this).referList.map((v) => (isStore(v) ? (v as Store).get() : v));
  }
  public get referenceList(): Store[] {
    return freeze(_(this).referenceList as Store[]);
  }

  public get initiator(): Store | null {
    return _(this).initiator;
  }
  public get initiatorType(): string | null {
    return _(this).initiatorType;
  }
  public get initiatorTypeIsWatch(): boolean {
    return _(this).initiatorType === 'watch';
  }
  public get initiatorTypeIsRefer(): boolean {
    return _(this).initiatorType === 'refer';
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

    setOwnProps(this, {
      // _: { writable: 0, value: new __Service__(this, value, start) },
      0: { enumerable: 1, get: this.get, set: this.set }
    });

    __CACHE__.set(this, {
      value,
      previousValue: undefined,
      previousDifferingValue: undefined,
      start,
      stop: null,
      subscribers: [],
      watchList: [],
      watchableList: [],
      referList: [],
      referenceList: [],
      initiator: null,
      initiatorType: null,
      updating: false
    });

    (watchList = checkInputs(watchList)), (referList = checkInputs(referList));
    this.refer(referList), this.watch(watchList);
    Object.seal(this);
  }

  public get updating(): boolean {
    return _(this).updating;
  }
  __update__(
    newValue: Value,
    deep: Deep,
    _choice_?: _Choice_,
    initiator: Store | null = null,
    initiatorType: string | null = null
  ): this {
    const service = _(this);
    if (initiatorType === 'watch' && newValue === 0) newValue = service.value;

    if (!equal(service.value, newValue, deep)) {
      service.updating = true;
      service.previousValue = service.value;
      if (!equal(service.value, newValue, 0)) {
        service.previousDifferingValue = service.value;
      }
      service.value = newValue;

      service.initiator = initiator;
      service.initiatorType = initiatorType;

      const referenceList = service.referenceList;
      if ((!_choice_ || _choice_[2]) && referenceList.length) {
        for (let i = referenceList.length; (i -= 2) >= 0; undefined) {
          if (!(referenceList[i] as Store).updating) {
            // prettier-ignore
            (referenceList[i] as Store).__update__(service.value,
              referenceList[i + 1] as Deep, [1, 1, 1], this, 'refer');
          }
        }
      }

      const watchableList = service.watchableList;
      if ((!_choice_ || _choice_[1]) && watchableList.length) {
        for (let i = watchableList.length; (i -= 2) >= 0; undefined) {
          if (
            !watchableList[i].updating &&
            // prettier-ignore
            !equal(
              service.value, service.previousValue,
              watchableList[i + 1] as _Choice_)
          ) {
            // prettier-ignore
            (watchableList[i] as Store).__update__(0, null, [1], this, 'watch');
          }
        }
      }

      const subscribers = service.subscribers;
      if ((!_choice_ || _choice_[0]) && service.stop && subscribers.length) {
        for (let i = 0; i < subscribers.length; i++) {
          if (!subscribers[i].executing && !subscribers[i].unsubscribed) {
            subscribers[i].queue = QUEUE.length;
            subscribers[i].value = service.value;
            QUEUE.push(subscribers[i]);
          }
        }
      }

      if (!_choice_) __QUEUER_START__();
      service.updating = false;
    }

    return this;
  }

  public subscribe(
    subscribe: SubscribeStart = noop,
    autorun: boolean = true
  ): Unsubscriber {
    const service = _(this);
    const RUN = (cb: any, unsub?: Function): Function => {
      let res;
      if (!isFunc(unsub)) unsub = noop;
      if (isFunc(cb)) {
        res = cb.bind(this)(service.value, this, unsub);
      } else if (isPromise(cb)) {
        res = cb.then((cb: Function) => RUN(this)(cb, unsub));
      }
      return res || noop;
    };

    let execute = noop,
      unsubscribe = noop;

    let stop = noop;
    let executing = false;
    let unsubscribed = false;

    let initialized = false;

    const subscriber = {
      queue: -1,
      value: service.value,
      get executing(): boolean {
        return executing;
      },
      get unsubscribed(): boolean {
        return unsubscribed;
      },

      get execute(): Function {
        return execute;
      },

      get unsubscribe(): Function {
        return unsubscribe;
      }
    };
    Object.seal(subscriber);

    execute = (): SubscribeStop => {
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
        if (service.subscribers[0] === subscriber) {
          (service.initiator = null), (service.initiatorType = null);
        }
      };

      if (!isPromise(stop)) afterExecuting();
      else (stop as any).finally(() => afterExecuting());

      __QUEUER_START__();
      return stop;
    };

    unsubscribe = (): Store => {
      unsubscribed = true;
      if (!initialized) initialized = true;
      else {
        const index = service.subscribers.indexOf(subscriber);
        if (index !== -1) service.subscribers.splice(index, 1);

        RUN(stop);
        if (!service.subscribers.length) {
          RUN(service.stop), (service.stop = null);
        }
      }

      return this;
    };

    service.subscribers.unshift(subscriber);
    if (!service.stop && service.subscribers.length) {
      service.stop = RUN(service.start, unsubscribe);
    }
    if (autorun) execute();

    if (initialized) unsubscribe();
    initialized = true;
    return unsubscribe;
  }

  public get(): Value {
    return _(this).value;
  }

  public setWeak(newValue: Value, deep: Deep = 0): this {
    return this.__update__(newValue, deep);
  }
  public setSure(newValue: Value): this {
    return this.setWeak(newValue, null);
  }
  public set(newValue: Value): this {
    return this.setWeak(newValue, -1);
  }

  public updateWeak(update: Function, deep: Deep = 0): this {
    const newValue = update(_(this).value, this, noop);
    if (!isPromise(newValue)) this.setWeak(newValue, deep);
    else newValue.then((value: Value) => this.setWeak(value, deep));
    return this;
  }
  public updateSure(update: Function): this {
    return this.updateWeak(update, null);
  }
  public update(update: Function): this {
    return this.updateWeak(update, -1);
  }

  public next(newValue: Value, deep = -1): this {
    return this.setWeak(newValue, deep);
  }
  public forceUpdate(): this {
    return this.__update__(_(this).value, null);
  }

  public clearSubscribers(): this {
    const service = _(this);
    while (service.subscribers.length) {
      service.subscribers[service.subscribers.length - 1].unsubscribe();
    }
    return this;
  }

  public clearWatchList(): this {
    return this.watch([]);
  }
  public clearWatchableList(): this {
    return this.watchable([]);
  }
  public clearReferList(): this {
    return this.refer([]);
  }
  public clearReferenceList(): this {
    return this.reference([]);
  }
  public clearBridges(): this {
    const service = _(this);
    service.referList.forEach((v) => {
      if (inArr(service.referenceList, v)) this.unrefer(v), this.unreference(v);
    });
    return this;
  }

  public clearAll(): this {
    this.clearReferList(), this.clearReferenceList();
    this.clearWatchList(), this.clearWatchableList();
    this.clearSubscribers();
    return this;
  }

  public referenceWeak(store: Store | Store[], deep: Deep = 0): this {
    const service = _(this);
    return __watchable__(this, store, deep, [
      service.referenceList as Store[],
      service.referList,
      'reference',
      'refer',
      true,
      false
    ]) as this;
  }
  public referenceSure(store: Store | Store[]): this {
    return this.referenceWeak(store, null);
  }
  public reference(store: Store | Store[]): this {
    return this.referenceWeak(store, -1);
  }
  public unreference(store: Store | Store[]): this {
    const service = _(this);
    return __unwatchable__(this, store, [
      service.referenceList as Store[],
      service.referList,
      'reference',
      'refer'
    ]) as this;
  }

  public watchableWeak(store: Store | Store[], deep: Deep = 0): this {
    const service = _(this);
    return __watchable__(this, store, deep, [
      service.watchableList,
      service.watchList,
      'watchable',
      'watch',
      false,
      [1]
    ]) as this;
  }
  public watchableSure(store: Store | Store[]): this {
    return this.watchableWeak(store, null);
  }
  public watchable(store: Store | Store[]): this {
    return this.watchableWeak(store, -1);
  }
  public unwatchable(store: Store | Store[]): this {
    const service = _(this);
    return __unwatchable__(this, store, [
      service.watchableList,
      service.watchList,
      'watchable',
      'watch'
    ]) as this;
  }

  public referWeak(store: Store | Store[], deep: Deep = 0): this {
    const service = _(this);
    return __watch__(this, store, deep, [
      service.referList,
      service.referenceList as Store[],
      'reference'
    ]) as this;
  }
  public referSure(store: Store | Store[]): this {
    return this.referWeak(store, null);
  }
  public refer(store: Store | Store[]): this {
    return this.referWeak(store, -1);
  }
  public unrefer(store: Store | Store[]): this {
    const service = _(this);
    return __unwatch__(this, store, [
      service.referList,
      service.referenceList as Store[],
      'reference'
    ]) as this;
  }

  public watchWeak(store: Store | Store[], deep: Deep = 0): this {
    const service = _(this);
    return __watch__(this, store, deep, [
      service.watchList,
      service.watchableList,
      'watchable'
    ]) as this;
  }
  public watchSure(store: Store | Store[]): this {
    return this.watchWeak(store, null);
  }
  public watch(store: Store | Store[]): this {
    return this.watchWeak(store, -1);
  }
  public unwatch(store: Store | Store[]): this {
    const service = _(this);
    return __unwatch__(this, store, [
      service.watchList,
      service.watchableList,
      'watchable'
    ]) as this;
  }

  public bridgeWeak(store: Store | Store[], deep: Deep = 0): this {
    return __cross__(this, store, deep, [
      'refer',
      'reference',
      'referWeak'
    ]) as this;
  }
  public bridgeSure(store: Store | Store[]): this {
    return this.bridgeWeak(store, null);
  }
  public bridge(store: Store | Store[]): this {
    return this.bridgeWeak(store, -1);
  }
  public unbridge(store: Store | Store[]): this {
    return __uncross__(this, store, ['refer']) as this;
  }

  public valueOf!: () => Value;
  public toString!: () => string;
  public toJSON!: () => string;
}

const ownerizesStore = setOwnProps(Store.prototype);

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
