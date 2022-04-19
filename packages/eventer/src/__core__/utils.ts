/* eslint-disable func-names */
/* eslint-disable no-invalid-this */

import { TypeElement, TypeEventSettings } from '.'
import { PRESSED_KEYS } from '.'

export const isBrowser = typeof window !== 'undefined'

export const isPointers = isBrowser && 'onpointermove' in document

export const isArray = Array.isArray

export const noop = (): void => {}
export const noopNoop = (): (() => void) => noop
export const preventDefault = (e: any): void => { e.preventDefault() }
export const stopPropagation = (e: any): void => { e.stopPropagation() }

export const addEvent = (
  target: TypeElement, type: string, listener: any, options: any
): void => {
  target.addEventListener(type, listener, options)
}

export const delEvent = (
  target: TypeElement, type: string, listener: any
): void => {
  target.removeEventListener(type, listener)
}

export const wmset = <T>(
  weakmap: WeakMap<any, any>, key: any, value: T
): T => (weakmap.set(key, value), value)

const REG = /^([a-z]+)|([.\d]+)|\(([^)]+)\)|\[([^\]]+)\]|(?<=\W)(\w+)/g
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getEventSettings = (s: string) => {
  const res = {
    type: '',
    num : 500,

    self   : false,
    trusted: false,
    
    once   : false,
    stop   : false,
    prevent: false,
    
    passive: false,
    capture: false,
    
    x: false,
    y: false,
    u: false,
    d: false,
    l: false,
    r: false,

    xy: false,

    keys: {} as { [key: string]: any },
    kLen: 0
  }

  REG.lastIndex = 0
  let matches: RegExpExecArray | null, v: string
  for (;matches = REG.exec(s);) {
    // event type
    if (v = matches[1]) res.type = v
    // special for time events
    else if (v = matches[2]) res.num = +v * 1000
    // KeyCodes
    if ((v = matches[3]) || (v = matches[4])) res.kLen++, res.keys[v] = 1
    // other
    else if (v = matches[5]) (v in res || (v = v[0]) in res) && ((res as any)[v] = true)
  }
  res.xy = res.x || res.y || res.u || res.d || res.l || res.r
  return res
}

export const wrap_base = (fns: Function[]) =>
  function (this: any, e: any): void { for (let i = 0; i < fns.length; i++) fns[i].call(this, e) }
export const wrap_keys = (fn: Function, es: TypeEventSettings) =>
  function (this: any, e: any): void { pressedKeysIsEqual(es) && fn.call(this, e) }
export const wrap_self = (fn: Function) =>
  function (this: any, e: any): void { e.target === this && fn.call(this, e) }
export const wrap_trusted = (fn: Function) =>
  function (this: any, e: any): void { e.isTrusted && fn.call(this, e) }

export const pressedKeysIsEqual = (es: TypeEventSettings): boolean => {
  let n = es.kLen
  for (const k in PRESSED_KEYS) {
    // @ts-ignore
    if (PRESSED_KEYS[k][0] in es.keys || PRESSED_KEYS[k][1] in es.keys) n--
    else break
  }
  return n <= 0
}
