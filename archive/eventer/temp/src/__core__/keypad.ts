import { TypeUnlistener } from '.'
import { isBrowser, noop, noopNoop, isArray } from '.'
import { createItemData, TypeItemData } from '.'
import { listen } from '.'

export type TypeKeypadEvent = KeyboardEvent
export type TypeKeypadCallback = (e: TypeKeypadEvent) => any
export type TypeAddKeypadEvent =
  (type: string | string[], callback: TypeKeypadCallback | TypeKeypadCallback[]) => TypeUnlistener

export const KEY_BINDINGS: [TypeItemData['keys'], Function[]][] = []
  
export const keypad: TypeAddKeypadEvent = !isBrowser
  ? noopNoop
  : (evt, cb): TypeUnlistener => {
    let unsub = noop
    if (!isArray(evt)) {
      listen[0]()
      const cbs = isArray(cb) ? cb.slice(0) : [cb]
      const data = createItemData(evt), keys = data.keys; if (!keys) throw evt
      const i = KEY_BINDINGS.push([keys, cbs])
      unsub = (): void => { cbs.length = 0 }
      if (data.oe) KEY_BINDINGS[i - 1][1].push(unsub)
    } else {
      const uns: TypeUnlistener[] = []
      for (let i = 0; i < evt.length; i++) uns.push(keypad(evt[i], cb))
      unsub = (): void => { for (;uns.length;) uns.pop()!() }
    }
    return unsub
  }
