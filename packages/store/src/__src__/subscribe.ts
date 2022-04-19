import { isFunction } from '@wareset-utilites/is/isFunction'
import { isArray } from '@wareset-utilites/is/isArray'

import { EH_SRV, EH_SUB, EN_LISTYPE } from '.'
import {
  TypeStore,
  TypeWatch,
  TypeService,
  TypeSubscriber,
  TypeUnsubscriber
} from '.'

import { isStore } from '.'
import { awaiter, watchStoreSetVals, noop } from '.'
import { createOrder, removeOrder } from '.'
import { runListenUpdate } from '.'
// import { launchQueue, addSubscriberInQueue } from '.'

type MS<V> = V extends TypeStore<infer S> ? S : V

export const storeSubscribe = ((
  list: any,
  _cb: (
    a: any[],
    unsubscriber: TypeUnsubscriber
  ) => void | (() => void) | Promise<() => void>,
  _props?: { lazy?: boolean }
): TypeUnsubscriber => {
  list = isArray(list) ? [...list] : [list]

  const watch: TypeWatch[] = []
  for (let service: TypeService, listCache: { [key: string]: TypeWatch } = {},
    i = 0; i < list.length; ++i) {
    if (isStore(list[i])) {
      if (!(service = list[i]._)[EH_SRV.destroyed]) {
        if (service[EH_SRV.id].v in listCache) {
          listCache[service[EH_SRV.id].v].push(i)
        } else {
          watch.push(listCache[service[EH_SRV.id].v] = [list[i], {}, i])
        }
      }
      list[i] = service[EH_SRV.value]
    }
  }

  let stop: any
  let ready = true

  let started = false
  let needUnsubscribe = !watch.length
  const unsubscriber = (): void => {
    needUnsubscribe = true
    if (ready && started) {
      ready = false
      removeOrder(sub._[EH_SRV.id])
      // @ts-ignore
      sub[EH_SUB.update] = sub[EH_SUB.destroy] = noop

      for (let j: number, service: TypeService, i = watch.length; i-- > 0;) {
        if ((j = (service = watch[i][0]._)[EH_SRV.subscribers]!.indexOf(sub)) > -1) {
          service[EH_SRV.subscribers]!.splice(j, 1)
          runListenUpdate(service, EN_LISTYPE.onSubscribe)
        }
      }
      watch.length = 0
      awaiter(stop, (newStop) => {
        isFunction(newStop) && newStop()
      })
    }
  }

  const __callbackAwaiter__ = (newStop: any): void => {
    stop = newStop, ready = true, needUnsubscribe && unsubscriber()
  }

  const callback = (): void => {
    if (ready) {
      started = !(ready = false)
      watchStoreSetVals(watch, list)
      awaiter(stop = _cb(list, unsubscriber),
        __callbackAwaiter__)
    }
  }

  const { lazy } = _props || {}

  const sub: TypeSubscriber = {
    _: {
      lazy          : !!lazy,
      [EH_SRV.id]   : createOrder(),
      [EH_SRV.watch]: watch
    },
    [EH_SUB.update] : callback,
    [EH_SUB.destroy]: unsubscriber,
    [EH_SUB.needRun]: false,
    [EH_SUB.force]  : false
  }

  for (let service: TypeService, i = watch.length; i-- > 0;) {
    ((service = watch[i][0]._)[EH_SRV.subscribers] ||
      (service[EH_SRV.subscribers] = [])).push(sub)
    runListenUpdate(service, EN_LISTYPE.onSubscribe)
  }
  if (!started) {
    // addSubscriberInQueue(callback), launchQueue()
    callback()
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
