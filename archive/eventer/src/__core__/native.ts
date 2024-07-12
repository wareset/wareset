import { TypeUnlistener, TypeElement } from '.'
import {
  isBrowser, noopNoop,
  isArray, getEventSettings,
  preventDefault, stopPropagation,
  wrap_base, wrap_trusted, wrap_keys, wrap_self,
  addEvent, delEvent
} from '.'

export declare type TypeNativeEvent = Event
export declare type TypeNativeEventListener = (e: TypeNativeEvent) => void
export declare type TypeNative = (
  target: TypeElement, event: string | string[],
  listeners?: TypeNativeEventListener | TypeNativeEventListener[],
) => TypeUnlistener

export const native: TypeNative = isBrowser ? (
  target: TypeElement, event: string | string[],
  listeners?: TypeNativeEventListener | TypeNativeEventListener[]
): TypeUnlistener => {
  let unsub: TypeUnlistener

  if (!isArray(event)) {
    // @ts-ignore
    const fns = [].concat(listeners) as any[]
    const es = getEventSettings(event)
    if (!es.type) throw event

    unsub = (): void => { fns.length = 0, delEvent(target, es.type, cb) }

    let cb = wrap_base(fns)
    if (es.once) fns.push(unsub)
    if (es.stop) fns.unshift(stopPropagation)
    if (es.prevent) fns.unshift(preventDefault)

    if (es.kLen) cb = wrap_keys(cb, es)
    if (es.self) cb = wrap_self(cb)
    if (es.trusted) cb = wrap_trusted(cb)

    addEvent(target, es.type, cb, { passive: es.passive, capture: es.capture })
  } else {
    const unsubs: TypeUnlistener[] = []
    for (let i = 0; i < event.length; i++) unsubs.push(native(target, event[i], listeners))
    unsub = (): void => { for (;unsubs.length;) unsubs.pop()!() }
  }

  return unsub
} : noopNoop
