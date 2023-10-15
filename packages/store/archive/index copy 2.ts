interface ISubscriber {
  // value
  v: any
  // prev sub
  p: ISubscriber
  // next sub
  n: ISubscriber
  // callback
  f: (...a: any) => void
}

interface IService<T = any, P = any> {
  // index
  i: number
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
  f: ((iam: IWSignal<T, P>) => void | ((iam: IWSignal<T, P>) => void)) | null
  // if last unsubscriber
  l: ((iam: IWSignal<T, P>) => void) | null | void
  // protect fn
  r: ((key: any) => P) | null
}

interface IComputedService {
  // signal
  readonly s: IWSignal
  // fn
  readonly c: Function
  // observe
  o: IWSignal[] | null
  // items
  readonly i: IWSignal[]
  // cache
  readonly x: { v: any; m: object | null; u: Function }[]

  // gtest
  g: any
  // locks
  l: number
  // needTest
  t: boolean
  // needRunComptute
  u: boolean
  // stamp
  m: object | null

  f: (this: IWSignal) => void
}

declare class IWSignal<T = any, P = any> {
  declare readonly _: IService<T, P>
  readonly _value: T
  get $(): T
  get(): T
  set(v: T, protect?: P): this
  subscribe(callback: (value: T) => void): () => void
  toString(...a: any): T extends { toString(...a: any): infer I } ? I : string
  valueOf(...a: any): T extends { valueOf(...a: any): infer I } ? I : T
  toJSON(...a: any): T extends { toJSON(...a: any): infer I } ? I : T
}

function noop() {}
let QUEUE: IWSignal[] = []

let STORE = function (value: any, props: any) {
  function THROW(s: string) {
    throw '@wareset/signal: ' + s
  }

  const is =
    Object.is ||
    (function (x, y) {
      return x === y ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y
    } as typeof Object.is)

  function run_queue(iam: WaresetSignal) {
    // console.log('Q', QUEUE.length)
    if (QUEUE.length > 4e4) THROW('queue cycle')
    if ((iam._.i = QUEUE.push(iam) - 1) === 0) {
      for (let i = 0, _: IService<any, any>; i < QUEUE.length; i++) {
        if ((_ = (iam = QUEUE[i])._).i === i) {
          for (_.n = _.s; (_.n = _.n.n) !== _.s && (_.c && computedTest(_.c), _.i === i); ) {
            is(_.n.v, (_.n.v = iam._value)) || _.n.f(_.n.v)
          }
        }
      }
      QUEUE = []
    }
  }

  let COMPUTED: IComputedService | null = null
  function peek(v$: WaresetSignal) {
    return v$.get()
  }

  function setNeedUpdate(a: IComputedService[]) {
    for (let i = a.length; i-- > 0; ) (a[i].t = a[i].u = true), setNeedUpdate(a[i].s._.w)
  }
  // let ii = 0
  let GVERSION = {}

  function computedCheckBeforeSet(iam: IComputedService) {
    if (iam.l === 0 && iam.g !== GVERSION) {
      iam.l++
      const COMPUTED_PREV = COMPUTED
      COMPUTED = null
      if (!iam.m && !iam.o) {
        iam.m = GVERSION
        COMPUTED = iam
        iam.c(iam.s._value, null)
        COMPUTED = null
      }
      for (let i = 0; i < iam.x.length; i++) {
        if (iam.i[i]._.c) computedTest(iam.i[i]._.c!)
        iam.x[i].v = iam.i[i]._value
      }
      COMPUTED = COMPUTED_PREV
      iam.g = GVERSION
      iam.t = false
      iam.l--
      iam.u = false
    }
  }
  function computedTest(iam: IComputedService) {
    // console.log('TEST 1', GVERSION !== iam.g)
    if (iam.l === 0 && iam.g !== GVERSION && (iam.t || iam.s._.s.n === iam.s._.s)) {
      // console.log('TEST', ++ii)
      iam.l++
      const COMPUTED_PREV = COMPUTED
      COMPUTED = null
      if (!iam.u) {
        for (let i = 0; i < iam.x.length; i++) {
          if (iam.i[i]._.c) computedTest(iam.i[i]._.c!)
          if (!is(iam.x[i].v, iam.i[i]._value)) {
            iam.u = true
            break
          }
        }
      }
      let value: any
      if (iam.u) {
        iam.m = GVERSION
        COMPUTED = iam.o ? null : iam
        value = iam.c(iam.s._value, iam.o && iam.o.map(peek))
        COMPUTED = null
        for (let i = iam.x.length; i-- > 0; ) {
          if (iam.o || iam.x[i].m === iam.m) iam.x[i].v = iam.i[i]._value
          else iam.i.splice(i, 1), iam.x.splice(i, 1)[0].u()
        }
      }
      COMPUTED = COMPUTED_PREV
      iam.g = GVERSION
      iam.t = false
      iam.l--
      if (iam.u) {
        iam.u = false
        iam.s.set(value, iam.s._.r && iam.s._.r(security))
      }
    }
  }

  function computedItemSubscribe(iam: IComputedService, item: WaresetSignal) {
    const w = item._.w
    w.push(iam)
    iam.l++
    const u = item.subscribe(iam.f)
    iam.l--
    return function () {
      w.splice(w.lastIndexOf(iam), 1), u()
    }
  }
  function computedItemCheck(iam: IComputedService, item: WaresetSignal) {
    if (item !== iam.s) {
      const i = iam.i.indexOf(item)
      // const isNeedSubscribe = iam.s._.s.n !== iam.s._.s
      if (i < 0) {
        iam.i.push(item)
        iam.x.push({
          m: iam.m,
          v: iam.s._value,
          u: iam.s._.s.n !== iam.s._.s ? computedItemSubscribe(iam, item) : noop
        })
      } else {
        // if (isNeedSubscribe === (iam.x[i].u === noop)) {
        //   console.error('@wareset/signal: sub error')
        //   // isNeedSubscribe ? iam.on() : iam.tn()
        // }
        iam.x[i].m = iam.m
      }
    }
  }

  function computedStart(iam: IComputedService) {
    for (let i = 0; i < iam.x.length && iam.s._.s.n !== iam.s._.s; i++) {
      if (iam.x[i].u === noop) iam.x[i].u = computedItemSubscribe(iam, iam.i[i])
    }
    iam.t = true
    computedTest(iam)
  }
  function computedUnsub(iam: IComputedService) {
    for (let u: any, i = iam.x.length; i-- > 0 && iam.s._.s.n === iam.s._.s; ) {
      ;(u = iam.x[i].u), (iam.x[i].u = noop), u()
    }
  }

  function computedCreate(signal: WaresetSignal, compute: Function, observe?: WaresetSignal[]) {
    let count = 0
    const iam: IComputedService = (signal._.c = {
      s: signal,
      c: compute,
      o: null,
      i: [],
      x: [],

      g: null,
      t: true,
      u: true,
      m: null,
      l: 0,

      f() {
        if (iam.l === 0 && iam.g !== GVERSION && iam.t) {
          if (count <= 0) {
            count = 0
            for (let i = 0; i < iam.x.length; i++) {
              if (iam.i[i]._.c) computedTest(iam.i[i]._.c!)
              if (!is(iam.x[i].v, iam.i[i]._value)) count++
            }
          }
          if (--count === 0) computedTest(iam)
        }
      }
    })

    if (observe) {
      const o: WaresetSignal[] = []
      for (let i = 0; i < observe.length; i++) {
        computedItemCheck(iam, observe[i]), o.push(observe[i])
      }
      iam.o = o
      iam.u = false
    }
  }

  function security(sec: any) {
    return function (key: any) {
      return key === security ? sec : null
    }
  }

  class WaresetSignal<T = any, P = any> {
    declare readonly _: IService<T, P>
    declare _value: T
    declare $: T

    constructor(
      value: T,
      props?: {
        protect?: P
        prepare?: (iam: WaresetSignal<T, P>) => void | ((iam: WaresetSignal<T, P>) => void)
        control?: (newValue: T, oldValue: T) => T
        compute?: (value: T, observe: any[]) => T
        observe?: WaresetSignal[]
      }
    ) {
      this._ = {
        // idx in
        i: -1,
        // sub qa
        s: { p: null, n: null } as unknown as ISubscriber,
        // cur qc
        n: null as unknown as ISubscriber,
        // sec sc
        r: props && props.protect != null ? security(props.protect) : null,
        // pre ps
        p: (props && props.control) || null,
        // fst fs
        f: (props && props.prepare) || null,
        // lst ls
        l: null,
        // obs wt
        w: [],
        // com cp
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
      const u = _.s.n === _.s && (_.c || _.f) ? this.subscribe(noop) : _.c && computedTest(_.c)
      const v = this._value
      if (u) u()
      COMPUTED = COMPUTED_PREV
      return v
    }

    set(v: T, protect?: P): this {
      const _ = this._
      // if (COMPUTED) throw '@wareset/signal: side-effects in computed'
      if (_.r && _.r(security) !== protect) THROW('protect')
      _.c && computedCheckBeforeSet(_.c)
      if (!is(this._value, (this._value = _.p ? _.p(v, this._value) : v))) {
        ;(GVERSION = {}), _.c && (_.c.g = GVERSION)
        setNeedUpdate(_.w), run_queue(this)
      }
      return this
    }

    subscribe(callback: (value: T) => void) {
      const iam = this,
        _ = iam._

      let sub = {
        v: null,
        p: null,
        n: null,
        f: noop
      } as unknown as ISubscriber
      _.n = (sub.p = (sub.n = _.n === _.s ? _.s : _.n.n).p).n = sub.n.p = sub

      if (_.s.n === sub) {
        if (_.c) computedStart(_.c)
        if (_.f) _.l = _.f(iam)
      }
      ;(sub.f = callback)((sub.v = iam._value))
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

  STORE = WaresetSignal
  const proto = STORE.prototype
  Object.defineProperty(proto, '$', { get: proto.get, set: proto.set })
  return new STORE(value, props)
} as any

// effector
// batching
// computed
// paysignal

// subject
// compute
// batched
// effect

// signal
// batch
// computed
// effect

export declare class ISignal<T> {
  readonly _value: T
  get $(): T
  set $(v: T)
  get(): T
  set(v: T): this
  subscribe(callback: (value: T) => void): () => void
  toString(...a: any): T extends { toString(...a: any): infer I } ? I : string
  valueOf(...a: any): T extends { valueOf(...a: any): infer I } ? I : T
  toJSON(...a: any): T extends { toJSON(...a: any): infer I } ? I : T
}
export declare class ISignalProtected<T, P> {
  readonly _value: T
  get $(): T
  get(): T
  set(v: T, protect: P): this
  subscribe(callback: (value: T) => void): () => void
  toString(...a: any): T extends { toString(...a: any): infer I } ? I : string
  valueOf(...a: any): T extends { valueOf(...a: any): infer I } ? I : T
  toJSON(...a: any): T extends { toJSON(...a: any): infer I } ? I : T
}

type IWatch = readonly [
  ISignal<any> | ISignalProtected<any, any>,

  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,

  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,

  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,

  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,
  (ISignal<any> | ISignalProtected<any, any>)?,

  ...(ISignal<any> | ISignalProtected<any, any>)[]
]

type IValues<W extends IWatch | undefined> = W extends undefined
  ? null
  : {
      -readonly [P in keyof W]: W[P] extends ISignal<any> | ISignalProtected<any, any>
        ? W[P]['_value']
        : never
    }

function signal<T, P = any, O extends IWatch | undefined = undefined>(
  value: T,
  props: {
    protect: P
    prepare?: (iam: ISignalProtected<T, P>) => void | ((iam: ISignalProtected<T, P>) => void)
    control?: (newValue: T, oldValue: T) => T
    compute?: (value: T, observe: IValues<O>) => T
    observe?: O
  }
): ISignalProtected<T, P>

function signal<T, O extends IWatch | undefined = undefined>(
  value: T,
  props?: {
    prepare?: (iam: ISignal<T>) => void | ((iam: ISignal<T>) => void)
    control?: (newValue: T, oldValue: T) => T
    compute?: (value: T, observe: IValues<O>) => T
    observe?: O
  }
): ISignal<T>

function signal(value: any, props?: any) {
  return new STORE(value, props)
}

function computed<T>(compute: () => T): ISignal<T> {
  return new STORE(void 0 as any, { compute })
}

function effect<T>(compute: () => T, onChange?: (value: T) => void): typeof noop {
  return new STORE(void 0 as any, { compute }).subscribe(onChange || noop)
}

let batcher$: IWSignal<typeof noop>
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

function isSignal(thing: any): thing is ISignal<any> | ISignalProtected<any, any> {
  return thing instanceof STORE
}

function isSignalProtected(thing: any): thing is ISignalProtected<any, any> {
  return thing instanceof STORE && !!thing._.r
}

export { signal, isSignal, isSignalProtected, computed, effect, batch }

// const a$ = signal<12>(12)
// const b$ = signal(true, { protect: 9 })
// const c$ = signal('')

// const qq$ = signal(11, {
//   observe: [a$, b$, c$],
//   compute: (v, a) => {
//     a[0] = 12
//     a[1] = false
//     console.log(v, a)
//     return v
//   }
// })
// console.log(qq$)

// const qq2$ = signal(11, {
//   observe: [a$, b$, c$],
// })
// console.log(qq2$)

// function idmini() {
//   const res: any[] = []
//   for (let i = 5; i-- > 0; ) res.push((Math.random() * 1e8).toString(36))
//   return res.join('')
// }
