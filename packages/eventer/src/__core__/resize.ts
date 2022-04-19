import { TypeUnlistener } from '.'

import { wmset, isBrowser, noopNoop, noop } from '.'

export declare type TypeResizeEvent<T = Element> = {
  target: T
  width: number
  height: number
  top: number
  left: number
}
export declare type TypeResizeEventListener<T = Element> = (e: TypeResizeEvent<T>) => void
export declare type TypeResize = <T = Element>(
  target: T, listeners: TypeResizeEventListener<T> | TypeResizeEventListener<T>[],
  autostart?: boolean
) => TypeUnlistener

export const resize = ((): TypeResize => {
  if (!isBrowser) return noopNoop

  type TypeWSR = [Function[][], DOMRectReadOnly, [number, number]]

  const WMR = new WeakMap()

  const getWH = (e: any): [number, number] =>
    'offsetWidth' in e ? [e.offsetWidth, e.offsetHeight] : [e.clientWidth, e.clientHeight]

  const update = (target: Element): void => {
    const wsr = WMR.get(target)
    let [width, height] = getWH(target)

    if (wsr[2][0] !== width || wsr[2][1] !== height) {
      wsr[2][0] = width, wsr[2][1] = height
      const rect = wsr[1] = target.getBoundingClientRect()
      width = rect.right - rect.left, height = rect.bottom - rect.top
      
      for (let j = 0; j < wsr[0].length; j++) {
        for (let fns = wsr[0][j], l = 0; l < fns.length; l++) {
          fns[l]({ target, width, height, top: rect.top, left: rect.left })
          if (!fns.length) {
            wsr[0].splice(j--, 1)
            wsr[0].length || (observer.unobserve(target), WMR.delete(target))
          }
        }
      }
    }
  }

  let observer: ResizeObserver
  let listen = (): void => {
    listen = noop
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver((a) => {
        for (let i = 0; i < a.length; i++) update(a[i].target)
      })
    } else {
      const E0 = [0]
      let timeoutid: any
      const ELEMENTS: any[] = []
      const __STO__ = setTimeout, __CTO__ = clearTimeout
      const loop = (): void => {
        __CTO__(timeoutid)
        for (E0[0] = 0; E0[0] < ELEMENTS.length; E0[0]++) update(ELEMENTS[E0[0]])
        if (ELEMENTS.length) timeoutid = __STO__(loop, 20)
      }
      document.addEventListener('visibilitychange', () => {
        document.hidden ? __CTO__(timeoutid) : loop()
      }, false)
      observer = {} as any
      observer.observe = (target: any): void => { ELEMENTS.push(target), __STO__(loop, 20) }
      observer.unobserve = (): void => { ELEMENTS.splice(E0[0]--, 1) }
    }
  }

  return (target: any, listeners: any, autostart = true): TypeUnlistener => {
    listen()
    const fns = [].concat(listeners) as any[]

    let rect: DOMRectReadOnly
    const wser: TypeWSR = WMR.get(target) || (observer.observe(target),
    wmset(WMR, target, [[], target.getBoundingClientRect(), getWH(target)]))
    wser[0].push(fns)

    if (autostart) {
      rect = wser[1]
      const width = rect.right - rect.left, height = rect.bottom - rect.top
      for (let i = 0; i < fns.length; i++) {
        fns[i]({ target, width, height, top: rect.top, left: rect.left })
      }
    }

    return (): void => { fns.length = 0 }
  }
})()
