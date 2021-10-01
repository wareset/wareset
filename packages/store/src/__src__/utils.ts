import { isPromise } from '@wareset-utilites/is/isPromise'

import { EH_SRV } from '.'

const __awaiterPromiseAll__ = (a: [any, any, any]): void => {
  a[2](a[0], a[1])
}

// prettier-ignore
export const awaiter = <T, A>(
  value: Promise<T> | T,
  cb: (value: T, value2: A) => void,
  value2?: A
): void => {
  isPromise(value)
    ? Promise.all([value, value2, cb]).then(__awaiterPromiseAll__)
    : cb(value, value2!)
}

export const remove = (list: any[], v: any): void => {
  for (let i = list.length; i-- > 0; )
    if (list[i] === v) {
      list.splice(i, 1)
      break
    }
}

export const storeIsUpdating = (v: any): any => v._[EH_SRV.updating]
