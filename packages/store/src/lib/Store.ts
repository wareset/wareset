// import defineProperty from '@wareset-utilites/object/defineProperty'
// import forEachLeft from '@wareset-utilites/array/forEachLeft'
import { instanceOf } from '@wareset-utilites/lang/instanceOf'
import { findRight } from '@wareset-utilites/array/findRight'
import { isFunction } from '@wareset-utilites/is/isFunction'
import { Array as __Array__ } from '@wareset-utilites/array/Array'
import { isObject } from '@wareset-utilites/is/isObject'
import { isArray } from '@wareset-utilites/is/isArray'
import { unique } from '@wareset-utilites/unique'

// export declare type TypeStore<T> = [T] & IStore<T>
export declare type TypeProxy = <T>(
  value: T | any,
  self: TypeStore<T>
) => Promise<T> | T
export declare type TypeProps = { lazy?: any; readonly?: boolean }

const isStore = (thing: any): thing is TypeStore<any> =>
  instanceOf(thing, Store)

// const createStoresList = (v: any): TypeStore<any>[] =>
//   unique(isStore(v) || !isArray(v) ? [v] : v, isStore)

let undef: undefined
const isProps = (v: any): boolean => v && isObject(v) && !isArray(v)

export declare interface TypeStore<T> {
  [key: string]: any
  readonly __: '@store-service@'

  isStore: typeof isStore

  0: T
  $: T
  value: T

  needUpdate: boolean | null | undefined

  readonly lazy: boolean
  readonly readonly: boolean
  readonly updating: boolean
  readonly destroyed: boolean

  get: () => T
  set: (newValue: Promise<T> | TypeStore<T> | T) => this
  update: (cb?: (value: T, store: this) => Promise<T> | T) => this
}

// prettier-ignore
class Store<T> extends __Array__ implements TypeStore<T> {
  readonly __!: '@store-service@'

  static isStore = isStore
  public isStore(thing: any): thing is TypeStore<any> {
    return isStore(thing)
  }

  public 0!: T
  public $!: T
  public value!: T

  public needUpdate!: boolean

  readonly lazy!: boolean
  readonly readonly!: boolean
  readonly updating!: boolean
  readonly destroyed!: boolean

  public get!: () => T
  public set!: (newValue: Promise<TypeStore<T> | T> | TypeStore<T> | T) => this
  public update!: (cb?: (value: T, store: this) => Promise<T> | T) => this

  readonly toString!: () => string
  readonly valueOf!: () => this[0]
  readonly toJSON!: () => any

  constructor(
    watch?:TypeStore<T>,
    props?: { lazy?: boolean, readonly?: boolean })
  constructor(
    value?:Promise<any> | TypeStore<T> | T,
    props?: { lazy?: boolean, readonly?: boolean })

  constructor(
    value: Promise<any> | TypeStore<T> | T, watch: TypeStore<T>,
    props?: { lazy?: boolean, readonly?: boolean })
  constructor(
    value: Promise<any> | TypeStore<T> | T, watchList: TypeStore<T>[],
    props?: { lazy?: boolean, readonly?: boolean })

  constructor(
    watch: TypeStore<T>,
    proxy: (newValue: T) => Promise<TypeStore<T> | T> | TypeStore<T> | T,
    props?: { lazy?: boolean, readonly?: boolean })
  constructor(
    value: Promise<any> | T,
    proxy: (newValue: T) => Promise<TypeStore<T> | T> | TypeStore<T> | T,
    props?: { lazy?: boolean, readonly?: boolean })

  constructor(
    value: Promise<any> | TypeStore<T> | T, watch: TypeStore<any>,
    proxy: (newValue: T | any) => Promise<TypeStore<T> | T> | TypeStore<T> | T,
    props?: { lazy?: boolean, readonly?: boolean })
  constructor(
    value: Promise<any> | TypeStore<T> | T, watchList: TypeStore<any>[],
    proxy: (newValue: T | any) => Promise<TypeStore<T> | T> | TypeStore<T> | T,
    props?: { lazy?: boolean, readonly?: boolean })

  constructor(
    value?: Promise<any> | TypeStore<T> | T,
    watch?: any, proxy?: any, props?: any) {
    super()

    props = findRight([watch, proxy, props], isProps)
    proxy = findRight([watch, proxy], isFunction)
    watch = !watch ? undef : isStore(watch)
      ? [watch] : isArray(watch) ? unique(watch, isStore) : undef
    if (!watch && isStore(value)) watch = [value]

    ;(this.__ as any)(this, value, watch, proxy, props)
  }
}

export { Store, isStore }
