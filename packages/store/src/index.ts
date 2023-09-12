interface ISubscriber {
  // prev sub
  p: ISubscriber
  // next sub
  n: ISubscriber
  // callback
  f: (...a: any) => void
}

interface IService<T> {
  i: number
  // version
  v: object
  // subscribers items
  s: ISubscriber
  // subscribers item currect
  o: ISubscriber
  // computeds for watch
  w: Computed[]
  c: null | Computed //ReturnType<typeof createComputed> | null
  // preset
  p: ((newValue: T, oldValue: T) => T) | null
  // if first subscriber
  f: ((iam: Store<T>) => void | ((iam: Store<T>) => void)) | null
  // if last unsubscriber
  l: ((iam: Store<T>) => void) | null | void
  // pass fn
  r: (key: any) => any
}

function noop() {}

function cycleDetected() {
  throw '@wareset/store: cycle detected'
}

const is =
  Object.is ||
  (function (x, y) {
    return x === y ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y
  } as typeof Object.is)

function is_not_equal(x: any, y: any): boolean {
  return !is(x, y) || (x && (typeof x === 'object' || typeof x === 'function'))
}

let QUEUE: Store<any>[] = []
function run_queue(iam: Store<any>) {
  // console.log('Q', QUEUE.length)
  if (QUEUE.length > 4e4) cycleDetected()
  if ((iam._.i = QUEUE.push(iam) - 1) === 0) {
    for (let i = 0, _: IService<any>; i < QUEUE.length; i++) {
      if ((_ = (iam = QUEUE[i])._).i === i) {
        for (_.o = _.s; (_.o = _.o.n) !== _.s && (_.c && _.c.tt(), _.i === i); ) {
          _.o.f.call(iam, iam._value)
        }
      }
    }
    QUEUE = []
  }
}

let COMPUTED: Computed | null = null
function pretest(iam: Computed) {
  let count = 0
  for (let i = iam.x.length; i-- > 0; ) {
    if (iam.i[i]._.c) iam.i[i]._.c!.tt()
    if (iam.x[i].v !== iam.i[i]._.v) count++
  }
  return count
}
function setNeedUpdate(a: Computed[]) {
  for (let i = a.length; i-- > 0; ) (a[i].a = true), setNeedUpdate(a[i].s._.w)
}
// let ii = 0
let GTEST: any = {}
class Computed {
  // store
  readonly s: Store<any>
  // fn
  readonly f: Function
  // items
  readonly i: Store<any>[]
  // cache
  readonly x: { v: object; m: object | null; u: Function }[]

  // gtest
  g: any
  // locks
  l: number
  // alter
  a: boolean
  // needUpdate
  u: boolean
  // stamp
  m: object | null

  readonly cb: (this: Store<any>) => void

  constructor(store: Store<any>, fn: Function) {
    this.s = store
    this.f = fn
    this.i = []
    this.x = []

    this.g = null
    this.a = true
    this.u = true
    this.m = null
    this.l = 0

    let count = 0
    const iam = this
    this.cb = function () {
      if (iam.l === 0 && GTEST !== iam.g && iam.a) {
        // console.log('UPDATE', ++ii)
        // if (++count >= pretest(iam)) (count = 0), (iam.u = true), iam.tt()
        // iam.tt()
        if (count <= 0) count = pretest(iam)
        if (--count === 0) (iam.u = true), iam.tt()
      }
    }
  }

  // postset
  ps() {
    if (this.l === 0) {
      this.l++
      this.g = GTEST
      if (this.u) {
        this.m = GTEST
        const COMPUTED_PREV = COMPUTED
        COMPUTED = this
        this.f(this.s._value)
        COMPUTED = COMPUTED_PREV
      }
      for (let i = this.x.length; i-- > 0; ) {
        if (this.i[i]._.c) this.i[i]._.c!.tt()
        this.x[i].v = this.i[i]._.v
        this.x[i].m === this.m
      }
      this.a = false
      this.u = false
      this.l--
    }
  }

  // test
  tt() {
    if (this.l === 0 && GTEST !== this.g && (this.a || this.s._.s.n === this.s._.s)) {
      const COMPUTED_PREV = COMPUTED
      COMPUTED = null
      // console.log('TEST', ++ii)
      this.l++
      this.g = GTEST
      // this.u = !this.m
      if (!this.u) {
        for (let i = this.x.length; i-- > 0; ) {
          if (this.i[i]._.c) this.i[i]._.c!.tt()
          if (this.x[i].v !== this.i[i]._.v) {
            this.u = true
            break
          }
        }
      }
      if (this.u) {
        this.m = GTEST
        this.a = false
        COMPUTED = this
        const value = this.f(this.s._value)
        COMPUTED = null
        for (let i = this.x.length; i-- > 0; ) {
          if (this.x[i].m === this.m) {
            this.x[i].v = this.i[i]._.v
          } else {
            this.x.splice(i, 1)[0].u()
            this.i.splice(i, 1)
          }
        }
        this.u = false
        this.s.set(value, this.s._.r(security))
      }
      this.l--
      COMPUTED = COMPUTED_PREV
    } else if (this.l > 0 && this.u) {
      cycleDetected()
    }
  }

  // subscribe
  sb(item: Store<any>) {
    const iam = this,
      w = item._.w
    w.push(iam)
    const u = item.subscribe(iam.cb)
    return function () {
      const i = w.lastIndexOf(iam)
      if (i > -1) w.splice(i, 1)
      u()
    }
  }

  // item
  it(item: Store<any>) {
    if (item !== this.s) {
      this.l++
      const i = this.i.indexOf(item)
      const isNeedSubscribe = this.s._.s.n !== this.s._.s
      if (i < 0) {
        this.i.push(item)
        this.x.push({
          m: this.m,
          v: this.s._.v,
          u: isNeedSubscribe ? this.sb(item) : noop
        })
      } else {
        if (isNeedSubscribe && this.x[i].u === noop) {
          this.x[i].u = this.sb(item)
        }
        this.x[i].m = this.m
      }
      this.l--
    }
  }

  // off
  un() {
    for (let i = this.x.length; i-- > 0; ) {
      this.x[i].u(), (this.x[i].u = noop)
    }
  }
}

function security(sec: any) {
  return function (key: any) {
    return key === security ? sec : void 0
  }
}

class Store<T = undefined> {
  declare readonly _: IService<T>
  declare readonly _value: T

  constructor(
    value: T,
    props?: {
      pass?: any
      start?: (iam: Store<T>) => void | ((iam: Store<T>) => void)
      preset?: (newValue: T, oldValue: T) => T
      compute?: (value: T) => T
    }
  ) {
    this._ = {
      i: -1,
      v: {},
      s: { p: null, n: null } as unknown as ISubscriber,
      o: null as unknown as ISubscriber,
      w: [],
      c: props && props.compute ? new Computed(this, props.compute) : null,
      p: (props && props.preset) || null,
      f: (props && props.start) || null,
      l: null,
      r: security(props ? props.pass : void 0)
    }
    this._.s.p = this._.s.n = this._.o = this._.s
    this._value = value // this._.p ? this._.p(value, value) : value
  }

  get $(): T {
    return this.get()
  }

  set $(v: T) {
    this.set(v)
  }

  get(): T {
    const _ = this._
    if (COMPUTED) COMPUTED.it(this)
    const u = _.s.n === _.s ? this.subscribe(noop) : (_.c && _.c.tt(), null)
    const v = this._value
    if (u) u()
    return v
  }

  set(v: T, pass?: any): this {
    const _ = this._
    if (_.r(security) !== pass) throw '@wareset/store: pass'
    _.c && _.c.ps()
    if (is_not_equal(this._value, _.p ? (v = _.p(v, this._value)) : v)) {
      ;((this as any)._value = v), (GTEST = _.v = {})
      setNeedUpdate(_.w)
      run_queue(this)
    }
    return this
  }

  subscribe(callback: (this: this, value: T) => void) {
    const iam = this,
      _ = iam._

    let sub = {
      p: null,
      n: null,
      f: noop
    } as unknown as ISubscriber
    _.o = (sub.p = (sub.n = _.o === _.s ? _.s : _.o.n).p).n = sub.n.p = sub

    if (_.s.n === sub) {
      if (_.c) (_.c.a = true), _.c.tt()
      if (_.f) _.l = _.f(iam)
    }
    sub.f = callback
    callback.call(iam, iam._value)
    return function () {
      if (sub) {
        ;(sub.p.n = sub.n), (sub.n.p = sub.p)
        ;(sub.f = noop), (sub = null as any)
        if (_.s.n === _.s) {
          if (_.l) _.l(iam)
          if (_.c) _.c.un()
        }
      }
    }
  }

  // toString() {
  //   return this.get() + ''
  // }
  // valueOf() {
  //   return this.get()
  // }
  // toJSON() {
  //   return this.get()
  // }
  toString(...a: any): T extends { toString(...a: any): infer I } ? I : string
  toString() {
    const v = this.$ as any
    return v == null || !v.toString ? '' + v : v.toString.apply(v, arguments)
  }
  valueOf(...a: any): T extends { valueOf(...a: any): infer I } ? I : T
  valueOf() {
    const v = this.$ as any
    return v == null || !v.valueOf ? v : v.valueOf.apply(v, arguments)
  }
  toJSON(...a: any): T extends { toJSON(...a: any): infer I } ? I : T
  toJSON(): any {
    const v = this.$ as any
    return v == null || !v.toJSON ? v : v.toJSON.apply(v, arguments)
  }
}

// effector
// batching
// computed
// paystore

// subject
// compute
// batched
// effect

// store
// batch
// computed
// effect

export declare class IStore<T> {
  readonly _value: T
  constructor(
    value: T,
    props?: {
      start?: (iam: IStore<T>) => void | ((iam: IStore<T>) => void)
      preset?: (newValue: T, oldValue: T) => T
      compute?: (value: T) => T
    }
  )
  get $(): T
  set $(v: T)
  get(): T
  set(v: T, pass?: any): this
  subscribe(callback: (this: this, value: T) => void): () => void
  toString(...a: any): T extends {
    toString(...a: any): infer I
  }
    ? I
    : string
  valueOf(...a: any): T extends {
    valueOf(...a: any): infer I
  }
    ? I
    : T
  toJSON(...a: any): T extends {
    toJSON(...a: any): infer I
  }
    ? I
    : T
}
export declare class IStoreSecurity<T, P> {
  readonly _value: T
  constructor(
    value: T,
    props?: {
      pass: P
      start?: (iam: IStoreSecurity<T, P>) => void | ((iam: IStoreSecurity<T, P>) => void)
      preset?: (newValue: T, oldValue: T) => T
      compute?: (value: T) => T
    }
  )
  get $(): T
  get(): T
  set(v: T, pass: P): this
  subscribe(callback: (this: this, value: T) => void): () => void
  toString(...a: any): T extends {
    toString(...a: any): infer I
  }
    ? I
    : string
  valueOf(...a: any): T extends {
    valueOf(...a: any): infer I
  }
    ? I
    : T
  toJSON(...a: any): T extends {
    toJSON(...a: any): infer I
  }
    ? I
    : T
}

function store<T>(
  value: T,
  props?: {
    start?: (iam: IStore<T>) => void | ((iam: IStore<T>) => void)
    preset?: (newValue: T, oldValue: T) => T
    compute?: (value: T) => T
  }
): IStore<T>

function store<T, P>(
  value: T,
  props: {
    pass: P
    start?: (iam: IStoreSecurity<T, P>) => void | ((iam: IStoreSecurity<T, P>) => void)
    preset?: (newValue: T, oldValue: T) => T
    compute?: (value: T) => T
  }
): IStoreSecurity<T, P>

function store<T>(value: T, props?: ConstructorParameters<typeof Store<T>>[1]) {
  return new Store(value, props)
}

let batcher$: Store<{ q: Function[] }>
function batch(func: () => void): void {
  if (!batcher$) {
    batcher$ = new Store({ q: [] } as any)
    batcher$.subscribe(function (v) {
      for (; v.q.length > 0; ) v.q.shift()!()
    })
  }
  batcher$._value.q.push(func)
  batcher$.set({ q: batcher$._value.q })
}

function computed<T>(compute: () => T) {
  return new Store(void 0 as any, { compute })
}

function effect<T>(compute: () => T, onChange?: (value: T) => void) {
  return new Store(void 0 as any, { compute }).subscribe(onChange || noop)
}

export { Store, store, batch, computed, effect }
