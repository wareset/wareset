import { instanceofFactory } from '@wareset-utilites/is/lib/instanceofFactory'
import { defineProperty } from '@wareset-utilites/object/defineProperty'
// import { isFunction } from '@wareset-utilites/is/isFunction'
import { isPromise } from '@wareset-utilites/is/isPromise'
// import { isArray } from '@wareset-utilites/is/isArray'

import { EH_SRV, EH_SUB } from '.'
import { TypeStore, TypeService, TypeContext } from '.'

import { awaiter, remove } from '.'
import { createOrder, removeOrder } from '.'
import { addWatcherLink, removeWatcherLink } from '.'
import { REFER_LIST, proxyWatch, proxyAutoWatch, proxyDefault, update } from '.'

// prettier-ignore
class Store<T> implements TypeStore<T> {
  declare readonly '@wareset/store': true
  declare readonly _: TypeService<T>

  declare readonly value: T
  declare public $: T

  get updating(): boolean {
    return this._[EH_SRV.updating]
  }

  get destroyed(): boolean {
    return this._[EH_SRV.destroyed]
  }

  declare toString: (...a: any[]) => string
  declare valueOf: (...a: any[]) => T
  declare toJSON: (...a: any[]) => any

  constructor(
    context: TypeContext,
    value?: Promise<TypeStore<T> | T> | TypeStore<T> | T,
    watch?: TypeStore<T | any>[] | null,
    proxy?:
      | ((newValue: T | any) => Promise<TypeStore<T> | T> | TypeStore<T> | T)
      | null,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ) {
    const valueIsPromise = isPromise(value)
    const valueIsStore = valueIsPromise ? false : isStore(value)
    const valueClear: any = valueIsPromise
      ? void 0 : valueIsStore ? (value as any)._[EH_SRV.value] : value
    // if (!watch && !proxy && valueIsStore) watch = [value as any]
    const { lazy, strict, inherit } = (props || {}) as any

    // const iam = this as TypeStore<T>

    this._ = {
      [EH_SRV.subscribers]: [],

      [EH_SRV.onSubscribe]: [],
      [EH_SRV.onDestroy]: [],
      [EH_SRV.onChange]: [],

      [EH_SRV.links]: [],
      [EH_SRV.watch]: [],

      [EH_SRV.destroyed]: false,
      [EH_SRV.updating]: false,

      [EH_SRV.id]: createOrder(),
      [EH_SRV.value]: valueClear,
      [EH_SRV.valueOrigin]: valueClear,
      [EH_SRV.nextcb]: null,
      [EH_SRV.proxyOrigin]: proxy,
      [EH_SRV.proxy]: !proxy ? proxyDefault : watch ? proxyWatch : proxyAutoWatch,

      [EH_SRV.context]: context,

      lazy: !!lazy,
      strict: strict === void 0 || !!strict,
      inherit: inherit === void 0 ? !proxy : !!inherit
    }
    ;(this as any).value = value

    if (watch) {
      const watchCache: any = {}
      for (const watcher of watch) {
        if (
          isStore(watcher) &&
          !watcher._[EH_SRV.destroyed] &&
          !(watcher._[EH_SRV.id][0] in watchCache))
        {
          addWatcherLink(watcher, this), this._[EH_SRV.watch].push(watcher)
          watchCache[watcher._[EH_SRV.id][0]] = 1
        }
      }
    }

    if (valueIsPromise || proxy) this.set(value as any)
  }

  public get(): T {
    if (REFER_LIST.length > 0)
      REFER_LIST[REFER_LIST.length - 1][1][this._[EH_SRV.id][0]] = this
    return this._[EH_SRV.value]
  }

  public set(newValue: Promise<TypeStore<T> | T> | TypeStore<T> | T): void {
    const service = this._
    if (!service[EH_SRV.destroyed]) {
      if (service[EH_SRV.updating])
        service[EH_SRV.nextcb] = (): any => newValue
      else {
        service[EH_SRV.nextcb] = null
        service[EH_SRV.updating] = true
        awaiter(newValue, update, this)
      }
    }
  }

  public update(cb: (value: T, store: this) => Promise<T> | T): void {
    const service = this._
    if (!service[EH_SRV.destroyed]) {
      if (service[EH_SRV.updating])
        service[EH_SRV.nextcb] = cb
      else {
        service[EH_SRV.nextcb] = null
        service[EH_SRV.updating] = true
        awaiter(cb(service[EH_SRV.value], this), update, this)
      }
    }
  }

  public destroy(): void {
    const service = this._
    if (!service[EH_SRV.destroyed]) {
      service[EH_SRV.destroyed] = true

      for (const sub of service[EH_SRV.onDestroy]) {
        sub[EH_SUB.update]()
      }
      for (const sub of service[EH_SRV.subscribers]) {
        remove(sub._[EH_SRV.watch], this)
        if (!sub._[EH_SRV.watch].length) sub[EH_SUB.destroy]!()
      }
      for (const watcher of service[EH_SRV.watch]) {
        removeWatcherLink(watcher, this)
      }

      service[EH_SRV.links].length =
      service[EH_SRV.watch].length =
      service[EH_SRV.subscribers].length = 0

      for (const sub of service[EH_SRV.onSubscribe]) {
        sub[EH_SUB.update](), sub[EH_SUB.destroy]()
      }
      for (const sub of service[EH_SRV.onDestroy]) {
        sub[EH_SUB.destroy]()
      }

      service[EH_SRV.onChange].length =
      service[EH_SRV.onDestroy].length =
      service[EH_SRV.onSubscribe].length = 0

      // @ts-ignore
      service[EH_SRV.proxyOrigin] = service[EH_SRV.proxy] = service[EH_SRV.context] = null

      removeOrder(service[EH_SRV.id])
    }
  }
}

const StorePrototype = Store.prototype

// prettier-ignore
defineProperty(StorePrototype, '$', {
  get: StorePrototype.get, set: StorePrototype.set })

for (let i = 3, a = ['toString', 'valueOf', 'toJSON']; i-- > 0; ) {
  defineProperty(StorePrototype, a[i], {
    value: function (...a: any[]) {
      let val = this.get()
      val = val == null || !val[a[i]] ? val : val[a[i]](...a)
      return i ? val : val + ''
    }
  })
}

const isStore = instanceofFactory(Store)

// prettier-ignore
// const store = <T>(
//   value?: T,
//   watch?: any,
//   proxy?: any,
//   props?: any
// ): TypeStore<T> => {
//   if (!isArray(watch))
//     watch = isStore(watch)
//       ? [watch]
//       : ((props = proxy), (proxy = watch), null)
//   if (!isFunction(proxy))
//     proxy = ((props = proxy), null)
//   return new Store(value, watch, proxy, props)
// }

export { Store, isStore }
