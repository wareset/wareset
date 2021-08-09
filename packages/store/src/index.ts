import { TypeStore, Unsubscriber } from './lib'
import {
  Store,
  isStore,
  storeSubscribe as __storeSubscribe__,
  storeListener as __storeListener__,
  storeDestroy
} from './lib'

// type ArrayElement<
//   ArrayType extends readonly unknown[]
// > = ArrayType extends readonly (infer ElementType)[] ? ElementType : never

// prettier-ignore
const store: {
  <V, R = V, W1 = V, W2 = V, W3 = V, W4 = V, W5 = V, W6 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>,TypeStore<W3>,TypeStore<W4>,TypeStore<W5>,TypeStore<W6>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2|W3|W4|W5|W6, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, readonly?: boolean }
  ): RET
  <V, R = V, W1 = V, W2 = V, W3 = V, W4 = V, W5 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>,TypeStore<W3>,TypeStore<W4>,TypeStore<W5>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2|W3|W4|W5, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, readonly?: boolean }
  ): RET
  <V, R = V, W1 = V, W2 = V, W3 = V, W4 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>,TypeStore<W3>,TypeStore<W4>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2|W3|W4, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, readonly?: boolean }
  ): RET
  <V, R = V, W1 = V, W2 = V, W3 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>,TypeStore<W3>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2|W3, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, readonly?: boolean }
  ): RET
  <V, R = V, W1 = V, W2 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, readonly?: boolean }
  ): RET

  <V, R = V, W = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<W>[],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, readonly?: boolean }
  ): RET
  <V, R = V, W = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<W>,
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, readonly?: boolean }
  ): RET


  <V, W1 = V, W2 = V, W3 = V, W4 = V, W5 = V, W6 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>,TypeStore<W3>,TypeStore<W4>,TypeStore<W5>,TypeStore<W6>],
    props?: { lazy?: boolean, readonly?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2 | W3 | W4 | W5 | W6>
  <V, W1 = V, W2 = V, W3 = V, W4 = V, W5 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>,TypeStore<W3>,TypeStore<W4>,TypeStore<W5>],
    props?: { lazy?: boolean, readonly?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2 | W3 | W4 | W5>
  <V, W1 = V, W2 = V, W3 = V, W4 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>,TypeStore<W3>,TypeStore<W4>],
    props?: { lazy?: boolean, readonly?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2 | W3 | W4>
  <V, W1 = V, W2 = V, W3 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>,TypeStore<W3>],
    props?: { lazy?: boolean, readonly?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2 | W3>
  <V, W1 = V, W2 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>,TypeStore<W2>],
    props?: { lazy?: boolean, readonly?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2>

  <V, W = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<W>[],
    props?: { lazy?: boolean, readonly?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W>
  <V, W = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<W>,
    props?: { lazy?: boolean, readonly?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W>
  <V, R = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    proxy: (newValue: V extends Promise<any> ? VP : V, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, readonly?: boolean }
  ): RET

  <V, R = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<any>[],
    proxy: (newValue: (V extends Promise<any> ? VP : V) | any, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, readonly?: boolean }
  ): RET

  <V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<any>[],
    props?: { lazy?: boolean, readonly?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | any>;
  <V, VP = V>(
    value?: Promise<VP> | TypeStore<V> | V,
    props?: { lazy?: boolean, readonly?: boolean }
  ): TypeStore<V extends Promise<any> ? (undefined | VP) : V>

  // <V>(
  //   value: Promise<V>,
  //   watch: TypeStore<any>[],
  //   props?: { lazy?: boolean, readonly?: boolean }
  // ): TypeStore<V | any | undefined>
  // <V>(
  //   value: TypeStore<V> | V,
  //   watch: TypeStore<any>[],
  //   props?: { lazy?: boolean, readonly?: boolean }
  // ): TypeStore<V | any>
  // <V>(
  //   value?:Promise<V>,
  //   props?: { lazy?: boolean, readonly?: boolean }
  // ): TypeStore<V | undefined>
  // <V>(
  //   value?:TypeStore<V> | V,
  //   props?: { lazy?: boolean, readonly?: boolean }
  // ): TypeStore<V>
} = ((value?: any, watch?: any, proxy?: any, props?: any) =>
  new Store(value, watch, proxy, props)) as any

// prettier-ignore
const storeSubscribe: {
  <A>(
    store: TypeStore<A>,
    subscriber: (v1: A) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): Unsubscriber
  <A>(
    stores:
      [TypeStore<A>|A],
    subscriber: (v1: A) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): Unsubscriber

  <A, B = A>(
    stores:
      [TypeStore<A>|A,TypeStore<B>|B],
    subscriber: (v1: A, v2: B) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): Unsubscriber
  <A, B = A, C = A>(
    stores:
      [TypeStore<A>|A,TypeStore<B>|B,TypeStore<C>|C],
    subscriber: (v1: A, v2: B, v3: C) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): Unsubscriber
  <A, B = A, C = A, D = A>(
    stores:
      [TypeStore<A>|A,TypeStore<B>|B,TypeStore<C>|C,TypeStore<D>|D],
    subscriber: (v1: A, v2: B, v3: C, v4: D) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): Unsubscriber
  <A, B = A, C = A, D = A, E = A>(
    stores:
      [TypeStore<A>|A,TypeStore<B>|B,TypeStore<C>|C,TypeStore<D>|D,TypeStore<E>|E],
    subscriber: (v1: A, v2: B, v3: C, v4: D, v5: E) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): Unsubscriber
  <A, B = A, C = A, D = A, E = A, F = A>(
    stores:
      [TypeStore<A>|A,TypeStore<B>|B,TypeStore<C>|C,TypeStore<D>|D,TypeStore<E>|E,TypeStore<F>|F],
    subscriber: (v1: A, v2: B, v3: C, v4: D, v5: E, v6: F) =>
      void | (() => void) | Promise<void | (() => void)>,
    props?: { lazy?: boolean }
  ): Unsubscriber

  (
    stores: (TypeStore<any> | any)[],
    subscriber: (...a: any[]) => void | (() => void) | Promise<void | (() => void)>
  ): Unsubscriber
} = __storeSubscribe__ as any

// prettier-ignore
const storeListener: {
  <T>(
    store: TypeStore<T>,
    type: 'subscribe',
    subscriber: (count: number, subscriber: null | TypeStore<any> |
      ((...a: any[]) => void | (() => void) | Promise<() => void>)) =>
        void | (() => void) | Promise<void | (() => void)>,
    autorun?: false
  ): Unsubscriber
  <T>(
    store: TypeStore<T>,
    type: 'subscribe',
    subscriber: (count: number, subscriber: TypeStore<any> |
      ((...a: any[]) => void | (() => void) | Promise<() => void>)) =>
        void | (() => void) | Promise<void | (() => void)>,
    autorun: true
  ): Unsubscriber
  <T>(
    store: TypeStore<T>,
    type: 'destroy',
    subscriber: (isStartDestroy: boolean) =>
      void | (() => void) | Promise<void | (() => void)>,
    autorun?: boolean
  ): Unsubscriber
  <T>(
    store: TypeStore<T>,
    type: 'update',
    subscriber: (status: boolean, currentValue: T) =>
      void | (() => void) | Promise<void | (() => void)>,
    autorun?: boolean
  ): Unsubscriber
  <T>(
    store: TypeStore<T>,
    type: 'change',
    subscriber: (newValue: T, oldValue: T) =>
      void | (() => void) | Promise<void | (() => void)>,
    autorun?: boolean
  ): Unsubscriber
} = __storeListener__ as any

// prettier-ignore
export const storeOnSubscribe: {
  <T>(
    store: TypeStore<T>,
    type: 'subscribe',
    subscriber: (count: number, subscriber: null | TypeStore<any> |
      ((...a: any[]) => void | (() => void) | Promise<() => void>)) =>
        void | (() => void) | Promise<void | (() => void)>,
    autorun?: false
  ): Unsubscriber
  <T>(
    store: TypeStore<T>,
    type: 'subscribe',
    subscriber: (count: number, subscriber: TypeStore<any> |
      ((...a: any[]) => void | (() => void) | Promise<() => void>)) =>
        void | (() => void) | Promise<void | (() => void)>,
    autorun: true
  ): Unsubscriber
} = (
  store: any,
  subscriber: any,
  autorun?: any
): Unsubscriber => storeListener(store, 'subscribe', subscriber, autorun)
// prettier-ignore
export const storeOnDestroy = <T>(
  store: TypeStore<T>,
  subscriber: (isStartDestroy: boolean) =>
    void | (() => void) | Promise<void | (() => void)>,
  autorun?: boolean
): Unsubscriber => storeListener(store, 'destroy', subscriber, autorun)
// prettier-ignore
export const storeOnUpdate = <T>(
  store: TypeStore<T>,
  subscriber: (status: boolean, currentValue: T) =>
    void | (() => void) | Promise<void | (() => void)>,
  autorun?: boolean
): Unsubscriber => storeListener(store, 'update', subscriber, autorun)
// prettier-ignore
export const storeOnChange = <T>(
  store: TypeStore<T>,
  subscriber: (newValue: T, oldValue: T) =>
    void | (() => void) | Promise<void | (() => void)>,
  autorun?: boolean
): Unsubscriber => storeListener(store, 'change', subscriber, autorun)

export { store, Store, isStore, storeListener, storeSubscribe, storeDestroy }
export default store

declare type TypeStoreClass<T> = new (value?: T, ...a: any[]) => TypeStore<T>
declare type TypeStoreFunction = typeof store
declare type TypeStoreSubscribeFunction = typeof storeSubscribe
declare type TypeStoreDestroyFunction = typeof storeDestroy
declare type TypeStoreListenerFunction = typeof storeListener

declare type TypeStoreOnSubscribeFunction = typeof storeOnSubscribe
declare type TypeStoreOnDestroyFunction = typeof storeOnDestroy
declare type TypeStoreOnUpdateFunction = typeof storeOnUpdate
declare type TypeStoreOnChangeFunction = typeof storeOnChange

export {
  TypeStore,
  TypeStoreClass,
  TypeStoreFunction,
  TypeStoreSubscribeFunction,
  TypeStoreDestroyFunction,
  TypeStoreListenerFunction,
  TypeStoreOnSubscribeFunction,
  TypeStoreOnDestroyFunction,
  TypeStoreOnUpdateFunction,
  TypeStoreOnChangeFunction
}
