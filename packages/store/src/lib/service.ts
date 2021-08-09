/* eslint-disable security/detect-non-literal-fs-filename */

import { defineProperty } from '@wareset-utilites/object/defineProperty'
import { forEachRight } from '@wareset-utilites/array/forEachRight'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { spliceWith } from '@wareset-utilites/array/spliceWith'
import { isFunction } from '@wareset-utilites/is/isFunction'
import { isArray } from '@wareset-utilites/is/isArray'
import { clear } from '@wareset-utilites/array/clear'
import { isNill } from '@wareset-utilites/is/isNill'
// import { keys } from '@wareset-utilites/object/keys'
import { unique } from '@wareset-utilites/unique'
import { is } from '@wareset-utilites/object/is'

import { isStore, TypeStore, TypeProxy, TypeProps } from './Store'
import { createOrder, removeOrder, TypeOrder } from './order'
import { awaiter } from './utils'
import {
  launchAutoWatch,
  createAutoWatch,
  updateAutoWatch,
  addWatcher,
  removeWatcher,
  TypeWatch,
  TypeWatchObservables
} from './watch'

import {
  launchQueue,
  launchListeners,
  addSubscriberInQueue,
  refreshSubscribersAndWatchers
} from './queue'

import { HK, VK, HSK, HLK, VLK } from './ekeys'

export declare type Unsubscriber = () => void

export declare type TypeService<T> = {
  [HK.subscribers]: TypeSubscriber[]
  [HK.listeners]: {
    [HLK.all]: TypeListener[]
    [HLK.subscribe]: TypeListener[]
    [HLK.destroy]: TypeListener[]
    [HLK.update]: TypeListener[]
    [HLK.change]: TypeListener[]
  }
  [HK.links]: TypeWatchObservables
  [HK.watch]: TypeWatch

  [HK.destroyed]: boolean
  [HK.updating]: boolean

  [HK.id]: TypeOrder
  [HK.valueOrigin]: T
  [HK.value]: T
  [HK.store]: TypeStore<T>

  [HK.get]: () => T
  [HK.set]: (v: Promise<T> | TypeStore<T> | T) => any
  [HK.update]: (cb?: (value: T, store: TypeStore<T>) => Promise<T> | T) => any

  [HK.lazy]: boolean

  [HK.isProxy]: boolean
  [HK.isNeedUpdate]: boolean | null
}

export declare type TypeSubscriber = {
  [HSK.lazy]?: boolean
  [HSK.id]: TypeOrder
  [HSK.watch]: TypeService<any>[]
  [HSK.update]: (...a: any[]) => void
  [HSK.destroy]?: () => void
  [HSK.subscribe]?: (...a: any[]) => void
}

export declare type TypeListener = {
  [HLK.destroy]: () => void
  [HLK.update]: (...a: any[]) => boolean
}

const NULL = null
let undef: undefined
const SERVICE_KEY = {}
const __ = <T>(v: any): TypeService<T> =>
  (v as any).__(SERVICE_KEY) as TypeService<T>

export const storeSubscribe = (
  _list: any,
  _cb: (...a: any[]) => void | (() => void) | Promise<() => void>,
  _props?: TypeProps
): Unsubscriber => {
  const list = isStore(_list) || !isArray(_list) ? [_list] : [..._list]
  const services = unique(list, isStore)
    .map(__)
    .filter((v) => !v[HK.destroyed])

  let stop: any
  let ready = true
  let unsubscribed: boolean
  let autorun = true
  // prettier-ignore
  const callback = (): void => {
    if (ready) {
      autorun = ready = false
      awaiter(
        (stop = _cb(...list.map((v) => (isStore(v) ? __(v)[HK.value] : v)))),
        (newStop) => { (stop = newStop), (ready = !unsubscribed) }) } }

  // prettier-ignore
  if (!services[0]) {
    callback(), awaiter(stop, (newStop) => { isFunction(newStop) && newStop() })
    return (): void => {}
  }

  const unsubscriber = (): void => {
    if (!unsubscribed) {
      ;(unsubscribed = true), (ready = false), removeOrder(subscriber[HSK.id])

      forEachLeft(services, (service) => {
        spliceWith(service[HK.subscribers], subscriber, 1)
        launchListeners(service, HLK.subscribe, [_cb])
      })

      clear(services)
      // prettier-ignore
      awaiter(stop, (newStop) => { isFunction(newStop) && newStop() })
    }
  }

  const { [VK[HK.lazy]]: lazy } = (_props || {}) as any

  const subscriber: TypeSubscriber = {
    [HSK.lazy]: lazy && !!services[1],

    [HSK.id]: createOrder(),
    [HSK.watch]: services,
    [HSK.destroy]: unsubscriber,
    [HSK.update]: callback,
    [HSK.subscribe]: _cb
  }

  forEachLeft(services, (service) => {
    service[HK.subscribers].push(subscriber)
    launchListeners(service, HLK.subscribe, [_cb])
  })
  if (autorun) addSubscriberInQueue(subscriber)
  return unsubscriber
}

export const storeListener = (
  _store: TypeStore<any>,
  _type: string,
  _cb: (...a: any[]) => void | (() => void) | Promise<() => void>,
  _autostart?: boolean
): Unsubscriber => {
  const service = __(_store)

  let type = VLK[_type]
  // prettier-ignore
  if (!type) type = _type === VK[HK.destroyed] ? HLK.destroy
    : _type === VK[HK.updating] ? HLK.update : type

  let stop: any
  let unsubscribed!: boolean

  // let updater!: () => any
  const startData: any = [NULL]
  // prettier-ignore
  // if (type === HLK.subscribe) {
  //   updater = (): any => service[HK.links].length+service[HK.subscribers].length
  // } else if (type === HLK.destroy) {
  //   updater = () : any => service[HK.destroyed]
  // } else if (type === HLK.update) {
  //   updater = () : any => service[HK.updating]
  //   startData[0] = service[HK.value]
  // } else if (type === HLK.change) {
  //   updater = () : any => service[HK.value]
  //   startData[0] = updater()
  // }

  // prettier-ignore
  const updater: () => any = ({
    [HLK.subscribe]:
      (): any => service[HK.links].length+service[HK.subscribers].length,
    [HLK.destroy]: (): any => service[HK.destroyed],
    [HLK.update]: (): any => service[HK.updating],
    [HLK.change]: (): any => service[HK.value]
  } as any)[type]!
  if (type === HLK.update || type === HLK.change)
    startData[0] = service[HK.value]

  // prettier-ignore
  const callback = (data?: [any?, Function?]): boolean =>
    unsubscribed
      ? unsubscribed
      : (
        (_autostart = false),
        (data = data || []),
        awaiter((stop = _cb(updater(), data[0])), (_stop) => { stop = _stop }),
        (!data[1] || data[1]())
      )

  // prettier-ignore
  if (service[HK.destroyed]) {
    callback(startData), awaiter(stop,
      (newStop) => { isFunction(newStop) && newStop() })
    return (): void => {}
  }

  // prettier-ignore
  const unsubscriber = (): void => {
    if (!unsubscribed) {
      unsubscribed = true
      spliceWith(service[HK.listeners][type as HLK.all], subscriber, 1)
      spliceWith(service[HK.listeners][HLK.all], subscriber, 1)
      awaiter(stop, (newStop) => { isFunction(newStop) && newStop() })
    }
  }

  const subscriber: TypeListener = {
    [HLK.destroy]: unsubscriber,
    [HLK.update]: callback
  }

  service[HK.listeners][type as HLK.all].push(subscriber)
  service[HK.listeners][HLK.all].push(subscriber)
  if (_autostart) callback(startData)
  return unsubscriber
}

export const storeDestroy = (
  _stores: TypeStore<any> | TypeStore<any>[]
): void => {
  forEachLeft(
    isStore(_stores) || !isArray(_stores) ? [_stores] : _stores,
    (store) => {
      if (isStore(store)) {
        const service = __(store)
        service[HK.destroyed] = true
        launchListeners(service, HLK.destroy, [NULL])

        forEachRight(service[HK.subscribers], (sub) => {
          spliceWith(sub[HSK.watch], service, 1)
          if (!sub[HSK.watch][0]) sub[HSK.destroy]!()
          else launchListeners(service, HLK.subscribe, [sub[HSK.subscribe]])
        })
        clear(service[HK.subscribers])

        clear(service[HK.links])
        forEachRight(service[HK.watch], (serviceWatcher) => {
          removeWatcher(service, serviceWatcher)
        })
        clear(service[HK.watch])

        forEachRight(service[HK.listeners][HLK.all], (listener) => {
          listener[HLK.destroy]!()
        })

        removeOrder(service[HSK.id])
      }
    }
  )
}

const getStoreValue = (v: TypeStore<any> | any): any =>
  isStore(v) ? v.get() : v

export const innerStoreService = <T>(
  _store: TypeStore<T>,
  _value: T,
  _watch?: TypeStore<T>[],
  _proxy?: TypeProxy,
  _props?: TypeProps
): void => {
  // console.log({ _store, _value, _watch, _proxy })
  const { [VK[HK.lazy]]: lazy } = (_props || {}) as any

  // let value: any // , oldValue: any, newValue: any
  const service: TypeService<T> = {
    [HK.subscribers]: [],
    [HK.listeners]: {
      [HLK.all]: [],
      [HLK.subscribe]: [],
      [HLK.destroy]: [],
      [HLK.update]: [],
      [HLK.change]: []
    },
    [HK.links]: [],
    [HK.watch]: [],

    [HK.destroyed]: false,
    [HK.updating]: false,

    [HK.id]: createOrder(),
    [HK.valueOrigin]: undef as any,
    [HK.value]: undef as any,
    [HK.store]: _store,

    [HK.get]: () => (launchAutoWatch(service), service[HK.value]),
    [HK.set]: (v) => (update(() => v), _store),
    [HK.update]: (cb) => (
      cb ? update(cb) : refreshSubscribersAndWatchers(service, true), _store
    ),

    [HK.lazy]: !!lazy,

    [HK.isProxy]: !!_proxy,
    [HK.isNeedUpdate]: NULL
  }

  if (_watch) {
    service[HK.watch] = _watch.map(
      (store, k: any) => (addWatcher(service, (k = __(store))), k)
    )
  }

  // prettier-ignore
  const proxy: (newValue: T, cb: (value: any) => void) => void =
    !_proxy
      ? (newValue, cb): void => { cb(newValue) }
      : _watch
        ? (newValue, cb): void => { awaiter(_proxy(newValue, _store), cb) }
        : (newValue, cb): void => {
          createAutoWatch(service)
          const mayBePromise = getStoreValue(_proxy(newValue, _store))
          updateAutoWatch(service)
          awaiter(mayBePromise, (newValue) => { cb(newValue) })
        }

  type TypeUpdateCb = (value: any, store: TypeStore<any>) => any
  type TypeUpdate = (callback: TypeUpdateCb) => void

  let nextcb: any
  let updating = false
  const update: TypeUpdate = (cb): void => {
    if (!service[HK.destroyed]) {
      if (updating) {
        nextcb = cb
      } else {
        nextcb = NULL
        updating = true
        service[HK.updating] = true
        const oldValue = service[HK.value]
        launchListeners(service, HLK.update, [oldValue])

        if (nextcb) (cb = nextcb), (nextcb = NULL)
        awaiter(cb(oldValue, _store), (newValue) => {
          if (nextcb) (updating = false), update(nextcb)
          else
            proxy(
              (service[HK.valueOrigin] = getStoreValue(newValue)),
              (newValue) => {
                if (nextcb) (updating = false), update(nextcb)
                else {
                  newValue = getStoreValue(newValue)

                  let isRefresh = false
                  if (
                    (service[HK.isNeedUpdate] !== false &&
                      !is(oldValue, newValue)) ||
                    service[HK.isNeedUpdate]
                  ) {
                    isRefresh = true
                    service[HK.value] = newValue
                    // prettier-ignore
                    launchListeners(service, HLK.change,
                      [oldValue, (): boolean => !nextcb])
                  }

                  if (nextcb) (updating = false), update(nextcb)
                  else {
                    service[HK.updating] = false
                    // prettier-ignore
                    launchListeners(service, HLK.update,
                      [newValue, (): boolean => !nextcb])
                    updating = false
                    if (nextcb) update(nextcb)
                    else {
                      const nu = service[HK.isNeedUpdate]
                      service[HK.isNeedUpdate] = NULL
                      isRefresh
                        ? refreshSubscribersAndWatchers(service, nu)
                        : launchQueue()
                    }
                  }
                }
              }
            )
        })
      }
    }
  }

  // prettier-ignore
  defineProperty(_store, '__', {
    value: (key: any): any => key === SERVICE_KEY ? service : NULL })
  // prettier-ignore
  forEachLeft([0, '$', 'value'], (v) => { defineProperty(_store, v, {
    enumerable: !v, get: () => _store.get(), set: (v) => { _store.set(v) } }) })

  // prettier-ignore
  defineProperty(_store, 'needUpdate', { get: () => service[HK.isNeedUpdate],
    set: (v) => { service[HK.isNeedUpdate] = isNill(v) ? NULL : !!v } })

  service[HK.set](_value)
}

export const blankStoreService = (k: number, fn?: boolean): any =>
  ({
    _: function (a: any[]): any {
      const v = (__(this) as any)[k]
      return fn ? v(a) : v
    }
  }._)
