/* eslint-disable camelcase */

import { isFunction } from '@wareset-utilites/is/isFunction'

import { EH_SRV, EH_SUB } from '.'
import { TypeStore, TypeService, TypeListener, TypeUnsubscriber } from '.'

import { awaiter, remove } from '.'

const __storeOnFactory__ = (
  store: TypeStore<any>,
  cb: (
    defaultValue: any,
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>,
  type: EH_SRV.onSubscribe | EH_SRV.onDestroy | EH_SRV.onChange,
  defaultValue: any,
  compareFn: (service: TypeService<any>, someValue: any) => any
): TypeUnsubscriber => {
  const service = store._

  let stop: any
  let unsubscribed: boolean
  // prettier-ignore
  const destroy = (): void => {
    if (!unsubscribed) {
      unsubscribed = true
      if (!service[EH_SRV.destroyed]) remove(service[type], subscriber)
      awaiter(stop, (newStop) => { isFunction(newStop) && newStop() })
      // @ts-ignore
      subscriber[EH_SUB.update] = subscriber[EH_SUB.destroy] = null
    }
  }

  // prettier-ignore
  const update = (someValue: any): void => {
    if (!unsubscribed) {
      stop = defaultValue === (defaultValue = compareFn(service, someValue))
        ? stop : cb(defaultValue, destroy)
    }
  }

  const subscriber: TypeListener = {
    [EH_SUB.update]: update,
    [EH_SUB.destroy]: destroy
  }

  service[type].push(subscriber), update(defaultValue)
  if (service[EH_SRV.destroyed]) destroy()
  return destroy
}

const __compareFnOnSubscribe__ = (service: TypeService<any>): number =>
  service[EH_SRV.subscribers].length + service[EH_SRV.links].length

// prettier-ignore
export const storeOnSubscribe = (
  store: TypeStore<any>,
  cb: (
    count: number,
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>
): TypeUnsubscriber =>
  __storeOnFactory__(store, cb, EH_SRV.onSubscribe, -1, __compareFnOnSubscribe__)

const __compareFnOnDestroy__ = (service: TypeService<any>): boolean =>
  !!service[EH_SRV.destroyed]

// prettier-ignore
export const storeOnDestroy = (
  store: TypeStore<any>,
  cb: (
    isDestroy: boolean,
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>
): TypeUnsubscriber =>
  __storeOnFactory__(store, cb, EH_SRV.onDestroy, false, __compareFnOnDestroy__)

const __dummy__ = {}
// prettier-ignore
const __compareFnOnChange__ = (service: TypeService<any>, someValue: any): any =>
  (someValue === __dummy__ ? __dummy__ : [someValue, service[EH_SRV.value]])

// prettier-ignore
export const storeOnChange = <T>(
  store: TypeStore<T>,
  cb: (
    oldValue_and_newValue: [T | undefined, T],
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>
): TypeUnsubscriber =>
    __storeOnFactory__(store, cb, EH_SRV.onChange, __dummy__, __compareFnOnChange__)
