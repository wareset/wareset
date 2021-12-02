import { instanceofFactory } from '@wareset-utilites/is/lib/instanceofFactory'
import { defineProperty } from '@wareset-utilites/object/defineProperty'
// import { isFunction } from '@wareset-utilites/is/isFunction'
import { isThenable } from '@wareset-utilites/is/isThenable'
// import { isArray } from '@wareset-utilites/is/isArray'

import { EH_SRV, EH_SUB, EN_LISTYPE } from '.'
import {
  TypeValueOf,
  TypeStore,
  TypeService,
  TypeContext,
  TypeSubscriber
} from '.'

import { awaiter, watchStoreRemove } from '.'
import { createOrder, removeOrder } from '.'
import { addWatcherLink, removeWatcherLink } from '.'
import { REFER_LIST, proxyWatch, proxyAutoWatch, proxyDefault, update } from '.'
import { runListenUpdate } from '.'

class Store<T> implements TypeStore<T> {
  // eslint-disable-next-line quotes
  declare readonly '@wareset/store': true
  declare readonly _: TypeService<T>

  declare readonly value: T
  declare public $: T

  get updating(): boolean {
    return this._[EH_SRV.updating]
  }

  get destroyed(): boolean {
    return !!this._[EH_SRV.destroyed]
  }

  set force(v: boolean) {
    this._[EH_SRV.force] = !!v
  }

  declare toString: (...a: any[]) => string
  declare valueOf: (...a: any[]) => TypeValueOf<T>
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
    const valueIsPromise = isThenable(value)
    const valueIsStore = valueIsPromise ? false : isStore(value)
    const valueClear: any = valueIsPromise
      ? void 0 : valueIsStore ? (value as any)._[EH_SRV.value] : value
    // if (!watch && !proxy && valueIsStore) watch = [value as any]
    const { lazy, strict, inherit } = (props || {}) as any

    // const iam = this as TypeStore<T>

    this._ = {
      [EH_SRV.id]: createOrder(),

      [EH_SRV.subscribers]: null,

      [EH_SRV.links]: null,
      [EH_SRV.watch]: watch || proxy ? [] : null,

      [EH_SRV.listeners]: null,

      // [EH_SRV.onSubscribe]: null,
      // [EH_SRV.onDestroy]: null,
      // [EH_SRV.onChange]: null,

      [EH_SRV.destroyed]: false,
      [EH_SRV.updating] : false,

      [EH_SRV.value]      : valueClear,
      [EH_SRV.valueOrigin]: valueClear,
      [EH_SRV.nextcb]     : null,
      [EH_SRV.proxyOrigin]: proxy,
      [EH_SRV.proxy]      : !proxy ? proxyDefault : watch ? proxyWatch : proxyAutoWatch,

      [EH_SRV.context]: context,

      lazy   : !!lazy,
      strict : strict === void 0 || !!strict,
      inherit: inherit === void 0 ? !proxy : !!inherit
      // [EH_SRV.force]: false
    };
    (this as any).value = value

    if (watch) {
      for (let watchCache: any = {},
        i = watch.length; i-- > 0;) {
        if (
          isStore(watch[i]) &&
          !watch[i]._[EH_SRV.destroyed] &&
          !(watch[i]._[EH_SRV.id].v in watchCache)) {
          this._[EH_SRV.watch]!.push([watch[i], {}])
          addWatcherLink(watch[i], this)
          watchCache[watch[i]._[EH_SRV.id].v] = 1
        }
      }
    }

    if (valueIsPromise || proxy) this.set(value as any)
  }

  public get(): T {
    if (REFER_LIST.b && REFER_LIST.l.length > 0) {
      REFER_LIST.l[REFER_LIST.l.length - 1][1][this._[EH_SRV.id].v] = this
    }
    return this._[EH_SRV.value]
  }

  public set(newValue: Promise<TypeStore<T> | T> | TypeStore<T> | T): void {
    const service = this._
    if (!service[EH_SRV.destroyed]) {
      if (service[EH_SRV.updating]) {
        service[EH_SRV.nextcb] = (): any => newValue
      } else {
        service[EH_SRV.nextcb] = null
        service[EH_SRV.updating] = true
        awaiter(newValue, update, this)
      }
    }
  }

  public update(cb: (value: T, store: this) => Promise<T> | T): void {
    const service = this._
    if (!service[EH_SRV.destroyed]) {
      if (service[EH_SRV.updating]) {
        service[EH_SRV.nextcb] = cb
      } else {
        service[EH_SRV.nextcb] = null
        service[EH_SRV.updating] = true
        awaiter(cb(service[EH_SRV.value], this), update, this)
      }
    }
  }

  public destroy(): void {
    storeDestroy(this)
  }
}

export const storeDestroy = (store: TypeStore): void => {
  const service = store._
  if (!service[EH_SRV.destroyed]) {
    runListenUpdate(service, EN_LISTYPE.onDestroy)
    service[EH_SRV.destroyed] = true

    if (service[EH_SRV.subscribers]) {
      for (let sub: TypeSubscriber,
        i = service[EH_SRV.subscribers]!.length; i-- > 0;) {
        sub = service[EH_SRV.subscribers]![i]
        watchStoreRemove(sub._[EH_SRV.watch]!, store)
        if (!sub._[EH_SRV.watch]!.length) sub[EH_SUB.destroy]()
      }
    }

    if (service[EH_SRV.watch]) {
      for (let i = service[EH_SRV.watch]!.length; i-- > 0;) {
        removeWatcherLink(service[EH_SRV.watch]![i][0], store)
      }
    }

    service[EH_SRV.subscribers] = service[EH_SRV.watch] = service[EH_SRV.links] = null

    // runListenUpdate(service, EN_LISTYPE.onSubscribe)
    if (service[EH_SRV.listeners]) {
      let liso = service[EH_SRV.listeners]![0]
      while (liso = liso.n!) {
        liso.v[EH_SUB.type] === EN_LISTYPE.onSubscribe && liso.v[EH_SUB.update]()
        liso.v[EH_SUB.destroy]()
      }
    }

    removeOrder(service[EH_SRV.id])

    // @ts-ignore
    service[EH_SRV.proxyOrigin] = service[EH_SRV.proxy] = service[EH_SRV.context] = null
  }
}

const StorePrototype = Store.prototype

defineProperty(StorePrototype, '$', { get: StorePrototype.get, set: StorePrototype.set })

for (let i = 3, a = ['toString', 'valueOf', 'toJSON']; i-- > 0;) {
  defineProperty(StorePrototype, a[i], {
    value: function(...a: any[]) {
      let val = this.get()
      val = val == null || !val[a[i]] ? val : val[a[i]](...a)
      return i ? val : val + ''
    }
  })
}

const isStore = instanceofFactory(Store)

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
