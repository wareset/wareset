// import { isFunction } from '@wareset-utilites/is/isFunction'
import { isPromise } from '@wareset-utilites/is/isPromise'
// import { isObject } from '@wareset-utilites/is/isObject'
import { keys } from '@wareset-utilites/object/keys'
// import { is } from '@wareset-utilites/object/is'

const testobj: any = {}
testobj[11] = 0
testobj[2] = 0
export const getSortedKeys =
  +keys(testobj)[0] === 2
    ? keys
    : (((obj: any): any => keys(obj).sort((a, b) => +a - +b)) as typeof keys)

export const awaiter = <T>(
  value: Promise<T> | T,
  cb: (value: T) => void
): void => {
  isPromise(value) ? Promise.resolve(value).then(cb) : cb(value)
}

// export const isEqual = (a: any, b: any, lazy?: boolean): boolean =>
//   false && !(!is(a, b) || (!lazy && (isFunction(a) || isObject(a))))
