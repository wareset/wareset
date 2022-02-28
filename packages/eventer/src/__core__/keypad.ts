import { TypeUnlistener, TypeEventSettings } from '.'
import {
  isBrowser, noopNoop,
  pressedKeysIsEqual,
  isArray, getEventSettings,
  preventDefault, stopPropagation,
  wrap_base, wrap_trusted, addEvent
} from '.'

export const PRESSED_KEYS = {}
const KEYPAD_LISTENERS: [TypeEventSettings, Function][] = []

;((): void => {
  if (isBrowser) {
    const keysListen = (): void => {
      addEvent(document, 'keyup', (e: KeyboardEvent) => {
        // @ts-ignore
        delete PRESSED_KEYS[e.code + e.key]
      }, false)
    
      addEvent(document, 'keydown', (e: KeyboardEvent) => {
        // @ts-ignore
        PRESSED_KEYS[e.code + e.key] = [e.code, e.key]
        // console.log([e.code, e.key], e)
    
        for (let i = 0; i < KEYPAD_LISTENERS.length; i++) {
          if (!KEYPAD_LISTENERS[i][0].kLen) KEYPAD_LISTENERS.splice(i--, 1)
          else if (pressedKeysIsEqual(KEYPAD_LISTENERS[i][0])) KEYPAD_LISTENERS[i][1](e)
        }
      }, false)
    }
    keysListen()
  }
})()

export declare type TypeKeypadEvent = KeyboardEvent
export declare type TypeKeypadEventListener = (e: TypeKeypadEvent) => void
export declare type TypeKeypad = (
  event: string | string[], listeners?: TypeKeypadEventListener | TypeKeypadEventListener[],
) => TypeUnlistener

export const keypad: TypeKeypad = isBrowser ? (
  event: string | string[], listeners?: TypeKeypadEventListener | TypeKeypadEventListener[]
): TypeUnlistener => {
  let unsub: TypeUnlistener

  if (!isArray(event)) {
    // @ts-ignore
    const fns = [].concat(listeners) as any[]
    const es = getEventSettings(event)
    if (!es.kLen) throw event

    unsub = (): void => { es.kLen = fns.length = 0 }

    let cb = wrap_base(fns)
    if (es.once) fns.push(unsub)
    if (es.stop) fns.unshift(stopPropagation)
    if (es.prevent) fns.unshift(preventDefault)

    if (es.trusted) cb = wrap_trusted(cb)

    KEYPAD_LISTENERS.push([es, cb])
  } else {
    const unsubs: TypeUnlistener[] = []
    for (let i = 0; i < event.length; i++) unsubs.push(keypad(event[i], listeners))
    unsub = (): void => { for (;unsubs.length;) unsubs.pop()!() }
  }
  return unsub
} : noopNoop
