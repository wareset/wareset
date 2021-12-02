import { EH_SRV, EH_SUB, EH_CONTEXT } from '.'

export declare type TypeValueOf<T> = T extends
  | undefined
  | null
  | boolean
  | number
  | string
  | bigint
  | symbol
  ? T
  : T[keyof T]

export declare interface TypeStore<T = any> {
  readonly '@wareset/store': true
  // [key: string]: any
  readonly _: TypeService<T>
  $: T
  readonly value: T

  readonly updating: boolean
  readonly destroyed: boolean
  force: boolean

  get(): T
  set(newValue: Promise<T> | TypeStore<T> | T): void
  update(cb: (value: T, store: this) => Promise<T> | T): void
  destroy(): void

  toString(...a: any[]): string
  valueOf(...a: any[]): TypeValueOf<T>
  toJSON(...a: any[]): any
}

// export declare type TypeSubscriberOrder = {
//   v: TypeSubscriber
//   p?: TypeSubscriberOrder
//   n?: TypeSubscriberOrder
// }

export declare type TypeListenerOrder = {
  v: TypeListener
  p?: TypeListenerOrder | null
  n?: TypeListenerOrder | null
}

export declare type TypeWatch = [TypeStore, {}, number?, number?, number?]

export declare type TypeService<T = any> = {
  readonly [EH_SRV.id]: TypeOrder

  [EH_SRV.subscribers]: TypeSubscriber[] | null

  [EH_SRV.listeners]: [TypeListenerOrder, TypeListenerOrder] | null

  // [EH_SRV.onSubscribe]: [TypeListenerOrder, TypeListenerOrder] | null
  // [EH_SRV.onDestroy]: [TypeListenerOrder, TypeListenerOrder] | null
  // [EH_SRV.onChange]: [TypeListenerOrder, TypeListenerOrder] | null

  [EH_SRV.links]: TypeSubscriber[] | null
  [EH_SRV.watch]: TypeWatch[] | null

  [EH_SRV.destroyed]: boolean
  [EH_SRV.updating]: boolean

  [EH_SRV.value]: T
  [EH_SRV.valueOrigin]: T

  [EH_SRV.nextcb]: ((value: any, store: TypeStore | any) => any) | null
  readonly [EH_SRV.proxy]: (newValue: T, store: TypeStore<T>) => void
  readonly [EH_SRV.proxyOrigin]: Function | null | undefined

  readonly [EH_SRV.context]: TypeContext

  lazy: boolean
  strict: boolean
  inherit: boolean
  [EH_SRV.force]?: boolean
}

export declare type TypeUnsubscriber = () => void

export declare type TypeSubscriber = {
  readonly _: {
    readonly lazy: boolean
    readonly [EH_SRV.id]: TypeOrder
    [EH_SRV.watch]: TypeWatch[] | null
  }
  readonly [EH_SUB.update]: (...a: any[]) => void
  readonly [EH_SUB.destroy]: () => void
  [EH_SUB.needRun]: boolean
  [EH_SUB.force]: boolean
}

export const enum EN_LISTYPE {
  onSubscribe,
  onDestroy,
  onChange
}

export declare type TypeListener = {
  readonly [EH_SUB.update]: (someValue?: any) => void
  readonly [EH_SUB.destroy]: () => void
  readonly [EH_SUB.type]: EN_LISTYPE
}

// export declare type TypeOrder = [number, TypeOrder, TypeOrder | null]
export declare type TypeOrder = {
  v: number
  p?: TypeOrder | null
  n?: TypeOrder | null
}

export declare type TypeQueue = { [key: string]: TypeSubscriber }

export declare type TypeContext = {
  [EH_CONTEXT.QUEUE]: TypeQueue
  [EH_CONTEXT.QUEUE_IS_BLOCKED]: boolean
  [EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED]: boolean
}
