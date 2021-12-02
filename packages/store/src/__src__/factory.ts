import { isFunction } from '@wareset-utilites/is/isFunction'
import { isArray } from '@wareset-utilites/is/isArray'

import { EH_CONTEXT } from '.'
import { TypeStore, TypeContext } from '.'

import { Store, isStore } from '.'

export const contextFactory = (): TypeContext => ({
  [EH_CONTEXT.QUEUE]                 : {},
  [EH_CONTEXT.QUEUE_IS_BLOCKED]      : false,
  [EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED]: false
})

export const storeFactory = ((context?: TypeContext) => {
  context || (context = contextFactory())
  return (
    value?: any,
    watch?: any,
    proxy?: any,
    props?: any
  ): TypeStore => {
    if (!isArray(watch)) {
      watch = isStore(watch)
        ? [watch] : (props = proxy, proxy = watch, null)
    }
    if (!isFunction(proxy)) proxy = (props = proxy, null)
    return new Store(context!, value, watch, proxy, props)
  }
}) as (context?: TypeContext) => {
  <V, R = V, W1 = V, W2 = V, W3 = V, W4 = V, W5 = V, W6 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>, TypeStore<W3>, TypeStore<W4>, TypeStore<W5>, TypeStore<W6>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2|W3|W4|W5|W6, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): RET
  <V, R = V, W1 = V, W2 = V, W3 = V, W4 = V, W5 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>, TypeStore<W3>, TypeStore<W4>, TypeStore<W5>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2|W3|W4|W5, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): RET
  <V, R = V, W1 = V, W2 = V, W3 = V, W4 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>, TypeStore<W3>, TypeStore<W4>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2|W3|W4, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): RET
  <V, R = V, W1 = V, W2 = V, W3 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>, TypeStore<W3>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2|W3, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): RET
  <V, R = V, W1 = V, W2 = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W1|W2, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): RET

  <V, R = V, W = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<W>[],
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): RET
  <V, R = V, W = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<W>,
    proxy: (newValue: (V extends Promise<any> ? VP : V)|W, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): RET

  <V, W1 = V, W2 = V, W3 = V, W4 = V, W5 = V, W6 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>, TypeStore<W3>, TypeStore<W4>, TypeStore<W5>, TypeStore<W6>],
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2 | W3 | W4 | W5 | W6>
  <V, W1 = V, W2 = V, W3 = V, W4 = V, W5 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>, TypeStore<W3>, TypeStore<W4>, TypeStore<W5>],
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2 | W3 | W4 | W5>
  <V, W1 = V, W2 = V, W3 = V, W4 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>, TypeStore<W3>, TypeStore<W4>],
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2 | W3 | W4>
  <V, W1 = V, W2 = V, W3 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>, TypeStore<W3>],
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2 | W3>
  <V, W1 = V, W2 = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: [TypeStore<W1>, TypeStore<W2>],
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W1 | W2>

  <V, W = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<W>[],
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W>
  <V, W = V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<W>,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | W>
  <V, R = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    proxy: (newValue: V extends Promise<any> ? VP : V, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): RET

  <V, R = V, VP = V, RP = R,
  RET = TypeStore<R extends Promise<any>
  ? (V extends Promise<any> ? (undefined | RP) : (V | RP)) : R>>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<any>[],
    proxy: (newValue: (V extends Promise<any> ? VP : V) | any, store: RET) =>
      Promise<TypeStore<RP> | RP> | TypeStore<R> | R,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): RET

  <V, VP = V>(
    value: Promise<VP> | TypeStore<V> | V,
    watch: TypeStore<any>[],
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): TypeStore<(V extends Promise<any> ? (undefined | VP) : V) | any>;
  <V, VP = V>(
    value?: Promise<VP> | TypeStore<V> | V,
    props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  ): TypeStore<V extends Promise<any> ? (undefined | VP) : V>

  // <V>(
  //   value: Promise<V>,
  //   watch: TypeStore<any>[],
  //   props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  // ): TypeStore<V | any | undefined>
  // <V>(
  //   value: TypeStore<V> | V,
  //   watch: TypeStore<any>[],
  //   props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  // ): TypeStore<V | any>
  // <V>(
  //   value?:Promise<V>,
  //   props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  // ): TypeStore<V | undefined>
  // <V>(
  //   value?:TypeStore<V> | V,
  //   props?: { lazy?: boolean, strict?: boolean, inherit?: boolean }
  // ): TypeStore<V>
}
