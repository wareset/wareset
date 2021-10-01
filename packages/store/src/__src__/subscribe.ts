import { isFunction } from '@wareset-utilites/is/isFunction'
import { isArray } from '@wareset-utilites/is/isArray'

import { EH_SRV, EH_SUB } from '.'
import { TypeStore, TypeSubscriber, TypeUnsubscriber } from '.'

import { isStore } from '.'
import { awaiter, remove } from '.'
import { createOrder, removeOrder } from '.'
import { storeIsUpdating } from '.'
// import { launchQueue, addSubscriberInQueue } from '.'

type MS<V> = V extends TypeStore<infer S> ? S : V

// prettier-ignore
const __subGetValueMaybe__ = (v: any): any => (isStore(v) ? v._[EH_SRV.value] : v)
const __subGetValueStore__ = (v: any): any => v._[EH_SRV.value]
// const __subGetValueThink__ = (v: any): any => v

// prettier-ignore
export const storeSubscribe = ((
  _list: any,
  _cb: (
    a: any[],
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>,
  _props?: { lazy?: boolean }
): TypeUnsubscriber => {
  const list = !isArray(_list) ? [_list] : [..._list]

  const stores: TypeStore<any>[] = []
  const listCache: any = {}
  for (const watcher of list) {
    if (
      isStore(watcher) &&
      !watcher._[EH_SRV.destroyed] &&
      !(watcher._[EH_SRV.id][0] in listCache)
    ) {
      stores.push(watcher), (listCache[watcher._[EH_SRV.id][0]] = 1)
    }
  }

  // prettier-ignore
  const getValue = list.length === stores.length
    ? __subGetValueStore__
    : __subGetValueMaybe__

  let stop: any
  let ready = true
  let unsubscribed: boolean

  let started = false
  let needUnsubscribe = !stores.length
  // prettier-ignore
  const unsubscriber = (): void => {
    needUnsubscribe = true
    if (ready && !unsubscribed && started) {
      unsubscribed = !(ready = false)
      removeOrder(subscriber._[EH_SRV.id])

      for (const store of stores) {
        remove(store._[EH_SRV.subscribers], subscriber)
        for (const sub of store._[EH_SRV.onSubscribe]) sub[EH_SUB.update]()
      }

      stores.length = 0
      awaiter(stop, (newStop) => { isFunction(newStop) && newStop() })
      // @ts-ignore
      subscriber._[EH_SRV.id] = subscriber._[EH_SRV.watch] = null
      // @ts-ignore
      subscriber._ = subscriber[EH_SUB.update] = subscriber[EH_SUB.destroy] = null
    }
  }

  const __callbackAwaiter__ = (newStop: any): void => {
    ;(stop = newStop), (ready = true), needUnsubscribe && unsubscriber()
  }

  // prettier-ignore
  const callback = (): void => {
    if (ready && !unsubscribed) {
      started = !(ready = false)
      awaiter((stop = _cb(list.map(getValue), unsubscriber)),
        __callbackAwaiter__)
    }
  }

  const { lazy } = _props || {}

  const subscriber: TypeSubscriber = {
    _: {
      lazy: !!lazy,
      [EH_SRV.id]: createOrder(),
      [EH_SRV.watch]: stores
    },
    [EH_SUB.update]: callback,
    [EH_SUB.destroy]: unsubscriber,
    [EH_SUB.needRun]: false
  }

  for (const store of stores) {
    store._[EH_SRV.subscribers].push(subscriber)
    for (const sub of store._[EH_SRV.onSubscribe]) sub[EH_SUB.update]()
  }
  if (!started) {
    // addSubscriberInQueue(callback), launchQueue()
    if (!(lazy && stores.some(storeIsUpdating))) callback()
  }
  return unsubscriber
}) as {
  <A, B = A, C = B, D = C, E = D, F = E, G = F, H = G>(
    stores: [A, B, C, D, E, F, G, H],
    subscriber: (
      values: [MS<A>, MS<B>, MS<C>, MS<D>, MS<E>, MS<F>, MS<G>, MS<H>],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber
  <A, B = A, C = B, D = C, E = D, F = E, G = F>(
    stores: [A, B, C, D, E, F, G],
    subscriber: (
      values: [MS<A>, MS<B>, MS<C>, MS<D>, MS<E>, MS<F>, MS<G>],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber
  <A, B = A, C = B, D = C, E = D, F = E>(
    stores: [A, B, C, D, E, F],
    subscriber: (
      values: [MS<A>, MS<B>, MS<C>, MS<D>, MS<E>, MS<F>],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber
  <A, B = A, C = B, D = C, E = D>(
    stores: [A, B, C, D, E],
    subscriber: (
      values: [MS<A>, MS<B>, MS<C>, MS<D>, MS<E>],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber
  <A, B = A, C = B, D = C>(
    stores: [A, B, C, D],
    subscriber: (
      values: [MS<A>, MS<B>, MS<C>, MS<D>],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber
  <A, B = A, C = B>(
    stores: [A, B, C],
    subscriber: (
      values: [MS<A>, MS<B>, MS<C>],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber
  <A, B = A>(
    stores: [A, B],
    subscriber: (
      values: [MS<A>, MS<B>],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber
  <A>(
    stores: [A],
    subscriber: (
      values: [MS<A>],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber

  <V>(
    store: TypeStore<V>|V,
    subscriber: (
      values: [MS<V>],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber

  <S = TypeStore<any> | any | (TypeStore<any> | any)[]>(
    stores: S,
    subscriber: (
      values: (MS<S extends (infer A)[] ? A : S>)[],
      unsubscriber: TypeUnsubscriber) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): TypeUnsubscriber

  // (
  //   stores: TypeStore<any> | any | (TypeStore<any> | any)[],
  //   subscriber: (values: any[], unsubscriber: TypeUnsubscriber) =>
  //     void | (() => void) | Promise<void | (() => void)>,
  //   props?: { lazy?: boolean }
  // ): TypeUnsubscriber
}
