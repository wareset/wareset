import { isFunction } from '@wareset-utilites/is/isFunction'
import { isThenable } from '@wareset-utilites/is/isThenable'
import { isObject } from '@wareset-utilites/is/isObject'
import { is } from '@wareset-utilites/object/is'

import { EH_SRV } from '.'
import { TypeStore, TypeWatch } from '.'

export const isPromiseCustom = (value: any): boolean =>
  !!value && isFunction(value.then)

// const __awaiterPromiseAll__ = (a: [any, any, any]): void => {
//   a[2](a[0], a[1])
// }

export const awaiter = <T, A>(
  value: Promise<T> | T,
  cb: (value: T, value2: A) => void,
  value2?: A
): void => {
  isThenable(value)
    ? (value as any).then((value: any) => {
      cb(value, value2!)
    })
    // ? Promise.all([value, value2, cb]).then(__awaiterPromiseAll__)
    : cb(value as any, value2!)
}

export const noop = (): void => {}

// export const remove = (list: any[], v: any): void => {
//   for (let i = list.length; i-- > 0; )
//     if (list[i] === v) {
//       list.splice(i, 1)
//       break
//     }
// }

export const watchStoreRemove = (watch: TypeWatch[], v: TypeStore): void => {
  for (let i = watch.length; i-- > 0;) {
    if (watch[i][1] === v) {
      watch.splice(i, 1); break
    }
  }
}

export const isNotEqualValue = (store: TypeStore, value: any): boolean =>
  !store._.strict && (isObject(value) || isFunction(value)) ||
  !is(store._[EH_SRV.value], value)

export const watchStoreSetVals = (watch: TypeWatch[], list: any[]): void => {
  for (let i = watch.length; i-- > 0;) {
    watch[i][1] = watch[i][0]._[EH_SRV.value]
    for (let j = watch[i].length; j-- > 2;) {
      list[watch[i][j as 2]!] = watch[i][1]
    }
  }
}
