interface ISubscriber {
  // prev sub
  p: ISubscriber
  // next sub
  n: ISubscriber
  // callback
  f: (...a: any) => void
}

interface IService<T, P> {
  i: number
  // version
  v: object
  // subscribers items
  s: ISubscriber
  // subscribers item currect
  n: ISubscriber
  // computeds for watch
  w: IComputedService[]
  c: null | IComputedService //ReturnType<typeof createComputed> | null
  // preset
  p: ((newValue: T, oldValue: T) => T) | null
  // if first subscriber
  f: ((iam: WaresetStore<T, P>) => void | ((iam: WaresetStore<T, P>) => void)) | null
  // if last unsubscriber
  l: ((iam: WaresetStore<T, P>) => void) | null | void
  // pass fn
  r: (key: any) => P
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

let QUEUE: WaresetStore[] = []
function run_queue(iam: WaresetStore) {
  // console.log('Q', QUEUE.length)
  if (QUEUE.length > 4e4) cycleDetected()
  if ((iam._.i = QUEUE.push(iam) - 1) === 0) {
    for (let i = 0, _: IService<any, any>; i < QUEUE.length; i++) {
      if ((_ = (iam = QUEUE[i])._).i === i) {
        for (_.n = _.s; (_.n = _.n.n) !== _.s && (_.c && computedTest(_.c), _.i === i); ) {
          _.n.f.call(iam, iam._value)
        }
      }
    }
    QUEUE = []
  }
}

let COMPUTED: IComputedService | null = null
function peek(v$: WaresetStore) {
  return v$._value
}

function setNeedUpdate(a: IComputedService[]) {
  for (let i = a.length; i-- > 0; ) (a[i].u = true), setNeedUpdate(a[i].s._.w)
}
// let ii = 0
let GTEST = {}

function computedCheckBeforeSet(iam: IComputedService) {
  if (iam.l === 0) {
    iam.l++
    iam.g = GTEST
    if (iam.t && !iam.o) {
      const COMPUTED_PREV = COMPUTED
      COMPUTED = iam
      iam.c(iam.s._value, null)
      COMPUTED = COMPUTED_PREV
    }
    for (let i = 0; i < iam.x.length; i++) {
      if (iam.i[i]._.c) computedTest(iam.i[i]._.c!)
      iam.x[i].v = iam.i[i]._.v
    }
    iam.u = false
    iam.t = false
    iam.l--
  }
}
function computedTest(iam: IComputedService) {
  if (iam.l === 0 && GTEST !== iam.g && (iam.u || iam.s._.s.n === iam.s._.s)) {
    // console.log('TEST', ++ii)
    iam.l++
    iam.g = GTEST
    // iam.t = !iam.m
    if (!iam.t || iam.o) {
      for (let i = 0; i < iam.x.length; i++) {
        if (iam.i[i]._.c) computedTest(iam.i[i]._.c!)
        if (iam.x[i].v !== (iam.x[i].v = iam.i[i]._.v)) {
          iam.t = true
        }
      }
    }
    if (iam.t) {
      iam.m = GTEST
      const COMPUTED_PREV = COMPUTED
      COMPUTED = iam.o ? null : iam
      const value = iam.c(iam.s._value, iam.o && iam.o.map(peek))
      COMPUTED = COMPUTED_PREV
      if (!iam.o)
        for (let i = iam.x.length; i-- > 0; ) {
          if (iam.x[i].m !== iam.m) {
            iam.x.splice(i, 1)[0].u()
            iam.i.splice(i, 1)
          }
        }
      iam.u = false
      iam.t = false
      iam.s.set(value, iam.s._.r(security))
    }
    iam.l--
  } else if (iam.l > 0 && iam.t) {
    cycleDetected()
  }
}

function computedItemSubscribe(iam: IComputedService, item: WaresetStore) {
  const w = item._.w
  w.push(iam)
  iam.l++
  const u = item.subscribe(iam.f)
  iam.l--
  return function () {
    const i = w.lastIndexOf(iam)
    if (i > -1) w.splice(i, 1)
    u()
  }
}
function computedItemCheck(iam: IComputedService, item: WaresetStore) {
  if (item !== iam.s) {
    const i = iam.i.indexOf(item)
    // const isNeedSubscribe = iam.s._.s.n !== iam.s._.s
    if (i < 0) {
      iam.i.push(item)
      iam.x.push({
        m: iam.m,
        v: iam.s._.v,
        u: iam.s._.s.n !== iam.s._.s ? computedItemSubscribe(iam, item) : noop
      })
    } else {
      // if (isNeedSubscribe === (iam.x[i].u === noop)) {
      //   console.error('@wareset/store: sub error')
      //   isNeedSubscribe ? iam.on() : iam.un()
      // }
      iam.x[i].v = iam.i[i]._.v
      iam.x[i].m = iam.m
    }
  }
}

function computedStart(iam: IComputedService) {
  for (let i = 0; i < iam.x.length; i++) {
    if (iam.x[i].u === noop) iam.x[i].u = computedItemSubscribe(iam, iam.i[i])
  }
  iam.u = true
  computedTest(iam)
}
function computedUnsub(iam: IComputedService) {
  for (let i = iam.x.length; i-- > 0; ) {
    iam.x[i].u(), (iam.x[i].u = noop)
  }
}

interface IComputedService {
  // store
  readonly s: WaresetStore
  // fn
  readonly c: Function
  // observe
  o: WaresetStore[] | null
  // items
  readonly i: WaresetStore[]
  // cache
  readonly x: { v: object; m: object | null; u: Function }[]

  // gtest
  g: any
  // locks
  l: number
  // needUpdate
  u: boolean
  // forceTest
  t: boolean
  // stamp
  m: object | null

  f: (this: WaresetStore) => void
}
function computedCreate(store: WaresetStore, compute: Function, observe?: WaresetStore[]) {
  let count = 0
  const iam: IComputedService = (store._.c = {
    s: store,
    c: compute,
    o: null,
    i: [],
    x: [],

    g: null,
    u: true,
    t: true,
    m: null,
    l: 0,

    f() {
      if (iam.l === 0 && GTEST !== iam.g && iam.u) {
        if (count <= 0) {
          count = 0
          for (let i = 0; i < iam.x.length; i++) {
            if (iam.i[i]._.c) computedTest(iam.i[i]._.c!)
            if (iam.x[i].v !== iam.i[i]._.v) count++
          }
        }
        if (--count === 0) (iam.t = true), computedTest(iam)
      }
    }
  })

  if (observe) {
    const o: WaresetStore[] = []
    for (let i = 0; i < observe.length; i++) {
      computedItemCheck(iam, observe[i]), o.push(observe[i])
    }
    iam.o = o
    iam.t = false
  }
}

function security(sec: any) {
  return function (key: any) {
    return key === security ? sec : void 0
  }
}

class WaresetStore<T = any, P = any> {
  declare readonly _: IService<T, P>
  declare readonly _value: T
  declare $: T

  constructor(
    value: T,
    props?: {
      pass?: P
      start?: (iam: WaresetStore<T, P>) => void | ((iam: WaresetStore<T, P>) => void)
      preset?: (newValue: T, oldValue: T) => T
      compute?: (value: T, observe: any[]) => T
      observe?: WaresetStore[]
    }
  ) {
    this._ = {
      i: -1,
      v: {},
      s: { p: null, n: null } as unknown as ISubscriber,
      n: null as unknown as ISubscriber,
      r: security(props ? props.pass : void 0),
      p: (props && props.preset) || null,
      f: (props && props.start) || null,
      l: null,
      w: [],
      c: null
    }
    this._.s.p = this._.s.n = this._.n = this._.s
    this._value = value // this._.p ? this._.p(value, value) : value
    props && props.compute && computedCreate(this, props.compute, props.observe)
  }

  get(): T {
    const _ = this._
    const COMPUTED_PREV = COMPUTED
    COMPUTED = null
    if (COMPUTED_PREV) computedItemCheck(COMPUTED_PREV, this)
    const u = _.s.n === _.s ? this.subscribe(noop) : (_.c && computedTest(_.c))
    const v = this._value
    if (u) u()
    COMPUTED = COMPUTED_PREV
    return v
  }

  set(v: T, pass?: P): this {
    const _ = this._
    // if (COMPUTED) throw '@wareset/store: side-effects in computed'
    if (_.r(security) !== pass) throw '@wareset/store: pass'
    _.c && computedCheckBeforeSet(_.c)
    if (is_not_equal(this._value, _.p ? (v = _.p(v, this._value)) : v)) {
      ;((this as any)._value = v), (GTEST = _.v = {})
      _.c && (_.c.g = GTEST)
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
    _.n = (sub.p = (sub.n = _.n === _.s ? _.s : _.n.n).p).n = sub.n.p = sub

    if (_.s.n === sub) {
      if (_.c) computedStart(_.c)
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
          if (_.c) computedUnsub(_.c)
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
    const v = this.get() as any
    return v == null || !v.toString ? '' + v : v.toString.apply(v, arguments)
  }
  valueOf(...a: any): T extends { valueOf(...a: any): infer I } ? I : T
  valueOf() {
    const v = this.get() as any
    return v == null || !v.valueOf ? v : v.valueOf.apply(v, arguments)
  }
  toJSON(...a: any): T extends { toJSON(...a: any): infer I } ? I : T
  toJSON(): any {
    const v = this.get() as any
    return v == null || !v.toJSON ? v : v.toJSON.apply(v, arguments)
  }
}

let STORE = function (value: any, props: any) {
  STORE = WaresetStore
  const proto = STORE.prototype
  Object.defineProperty(proto, '$', { get: proto.get, set: proto.set })
  return new STORE(value, props)
} as unknown as typeof WaresetStore

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
  get $(): T
  set $(v: T)
  get(): T
  set(v: T): this
  subscribe(callback: (this: this, value: T) => void): () => void
  toString(...a: any): T extends { toString(...a: any): infer I } ? I : string
  valueOf(...a: any): T extends { valueOf(...a: any): infer I } ? I : T
  toJSON(...a: any): T extends { toJSON(...a: any): infer I } ? I : T
}
export declare class IStoreSecurity<T, P> {
  readonly _value: T
  get $(): T
  get(): T
  set(v: T, pass: P): this
  subscribe(callback: (this: this, value: T) => void): () => void
  toString(...a: any): T extends { toString(...a: any): infer I } ? I : string
  valueOf(...a: any): T extends { valueOf(...a: any): infer I } ? I : T
  toJSON(...a: any): T extends { toJSON(...a: any): infer I } ? I : T
}

type IWatch = readonly [
  IStore<any> | IStoreSecurity<any, any>,

  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,

  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,

  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,

  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,
  (IStore<any> | IStoreSecurity<any, any>)?,

  ...(IStore<any> | IStoreSecurity<any, any>)[]
]

type IValues<W extends IWatch | undefined> = W extends undefined
  ? null
  : {
      -readonly [P in keyof W]: W[P] extends IStore<any> | IStoreSecurity<any, any>
        ? W[P]['_value']
        : never
    }

function store<T, P = any, O extends IWatch | undefined = undefined>(
  value: T,
  props: {
    pass: P
    start?: (iam: IStoreSecurity<T, P>) => void | ((iam: IStoreSecurity<T, P>) => void)
    preset?: (newValue: T, oldValue: T) => T
    compute?: (value: T, observe: IValues<O>) => T
    observe?: O
  }
): IStoreSecurity<T, P>

function store<T, O extends IWatch | undefined = undefined>(
  value: T,
  props?: {
    start?: (iam: IStore<T>) => void | ((iam: IStore<T>) => void)
    preset?: (newValue: T, oldValue: T) => T
    compute?: (value: T, observe: IValues<O>) => T
    observe?: O
  }
): IStore<T>

function store(value: any, props?: any) {
  return new STORE(value, props)
}

function computed<T>(compute: () => T) {
  return new STORE(void 0 as any, { pass: {}, compute }) as IStoreSecurity<T, never>
}

function effect<T>(compute: () => T, onChange?: (value: T) => void) {
  return new STORE(void 0 as any, { compute }).subscribe(onChange || noop)
}

let batcher$: WaresetStore<typeof noop>
function batch(func: () => void): void {
  if (!batcher$) {
    batcher$ = new STORE(noop)
    batcher$.subscribe(function (v) {
      v()
    })
  }
  if (QUEUE.length > 0) func()
  else batcher$.set(func)
}

export { store, computed, effect, batch }

// const a$ = store<12>(12)
// const b$ = store(true, { pass: 9 })
// const c$ = store('')

// const qq$ = store(11, {
//   observe: [a$, b$, c$],
//   compute: (v, a) => {
//     a[0] = 12
//     a[1] = false
//     console.log(v, a)
//     return v
//   }
// })
// console.log(qq$)

// const qq2$ = store(11, {
//   observe: [a$, b$, c$],
// })
// console.log(qq2$)

// function idmini() {
//   const res: any[] = []
//   for (let i = 5; i-- > 0; ) res.push((Math.random() * 1e8).toString(36))
//   return res.join('')
// }
