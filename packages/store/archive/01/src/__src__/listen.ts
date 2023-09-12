/* eslint-disable camelcase */

import { isFunction } from '@wareset-utilites/is/isFunction'

import { EH_SRV, EH_SUB, EN_LISTYPE } from '.'
import {
  TypeStore,
  TypeService,
  TypeListener,
  TypeListenerOrder,
  TypeUnsubscriber
} from '.'

import { awaiter, noop } from '.'

const __add__ = (v: any, o: any, k: any): void => {
  o[k] = o[k].n = { v, p: o[k], n: null }
}
const __del__ = (id: any, o: any, k: any): void => {
  if (id.p) id.p.n = id.n
  if (o[k] === id) o[k] = id.p
  else if (id.n) id.n.p = id.p
  id.v = id.p = null
}

export const runListenUpdate = (
  service: TypeService,
  type: EN_LISTYPE.onSubscribe | EN_LISTYPE.onDestroy | EN_LISTYPE.onChange
): void => {
  if (service[EH_SRV.listeners]) {
    let liso = service[EH_SRV.listeners]![0]
    while (liso = liso.n!) {
      if (liso.v[EH_SUB.type] === type) liso.v[EH_SUB.update]()
    }
  }
}

const __storeOnFactory__ = (
  store: TypeStore,
  cb: (
    defaultValue: any,
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>,
  type: EN_LISTYPE.onSubscribe | EN_LISTYPE.onDestroy | EN_LISTYPE.onChange,
  defaultValue: any,
  compareFn: (service: TypeService, someValue: any) => any
): TypeUnsubscriber => {
  const service = store._

  let order: TypeListenerOrder
  let listeners = service[EH_SRV.listeners]!
  if (!listeners && !service[EH_SRV.destroyed]) {
    const first = { p: null, n: null }
    listeners = service[EH_SRV.listeners] = [first, first] as any
  }

  let stop: any
  const sub: TypeListener = {
    [EH_SUB.type]  : type,
    [EH_SUB.update]: (someValue: any): void => {
      stop = defaultValue === (defaultValue = compareFn(service, someValue))
        ? stop : cb(defaultValue, sub[EH_SUB.destroy])
      awaiter(stop, (newStop) => {
        stop = newStop
      })
    },
    [EH_SUB.destroy]: (): void => {
      if (order) __del__(order, listeners, 1)
      // @ts-ignore
      sub[EH_SUB.update] = sub[EH_SUB.destroy] = noop
      awaiter(stop, (stop) => {
        isFunction(stop) && stop()
      })
    }
  }

  if (service[EH_SRV.destroyed]) {
    sub[EH_SUB.update](defaultValue), sub[EH_SUB.destroy]()
  } else {
    __add__(sub, listeners, 1), order = listeners[1]
    sub[EH_SUB.update](defaultValue)
  }
  return sub[EH_SUB.destroy]
}

const __dummy__ = {}

const __compareFnOnSubscribe__ = (service: TypeService): number =>
  (service[EH_SRV.subscribers] ? service[EH_SRV.subscribers]!.length : 0) +
  (service[EH_SRV.links] ? service[EH_SRV.links]!.length : 0)

export const storeOnSubscribe = (
  store: TypeStore,
  cb: (
    count: number,
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>
): TypeUnsubscriber =>
  __storeOnFactory__(store, cb, EN_LISTYPE.onSubscribe, -1, __compareFnOnSubscribe__)

const __compareFnOnDestroy__ = (service: TypeService, some: any): any =>
  service[EH_SRV.destroyed] || some !== __dummy__ ? true : __dummy__

export const storeOnDestroy = (
  store: TypeStore,
  cb: (
    startDestroy: boolean,
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>
): TypeUnsubscriber =>
  __storeOnFactory__(store, cb, EN_LISTYPE.onDestroy, __dummy__, __compareFnOnDestroy__)

const __compareFnOnChange__ = (service: TypeService, someValue: any): any =>
  someValue === __dummy__ ? __dummy__ : [someValue, service[EH_SRV.value]]

export const storeOnChange = <T>(
  store: TypeStore<T>,
  cb: (
    oldValue_and_newValue: [T | undefined, T],
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>
): TypeUnsubscriber =>
    __storeOnFactory__(store, cb, EN_LISTYPE.onChange, __dummy__, __compareFnOnChange__)
