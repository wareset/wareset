import { TypeUnlistener } from '.'
import { isBrowser, noop, noopNoop, isArray } from '.'

export type TypeResizeEvent<T = HTMLElement | SVGElement> =
  { target: T, width: number, height: number }
export type TypeResizeCallback<T> = (e: TypeResizeEvent<T>) => any
export type TypeAddResizeEvent<T = HTMLElement | SVGElement> =
  (element: T, callback: TypeResizeCallback<T> | TypeResizeCallback<T>[], autostart: boolean) => TypeUnlistener

export const resize = ((): TypeAddResizeEvent => {
  if (!isBrowser) return noopNoop as TypeAddResizeEvent

  type TypeItem = [Function[][], number, number]
  const ELEMENTS: Map<Element, TypeItem> = new Map()

  const updatePosition = (
    item: TypeItem, target: any
  ): void => {
    const width = target.offsetWidth, height = target.offsetHeight
    if (item[1] !== width || item[2] !== height) {
      item[1] = width, item[2] = height
      for (let a = item[0], i = 0; i < a.length; i++) {
        if (!a[i].length) a.splice(i--, 1)
        else {
          for (let j = 0; j < a[i].length; j++) a[i][j]({ target, width, height })
        }
      }
    }
  }

  let observer: ResizeObserver
  let listen = (): void => {
    listen = noop
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver((a) => {
        for (let target: any, item: any, i = 0; i < a.length; i++) {
          if (item = ELEMENTS.get(target = a[i].target)) updatePosition(item, target)
        }
      })
    } else {
      let timeoutid: any
      const __STO__ = setTimeout, __CTO__ = clearTimeout
      const loop = (): void => {
        __CTO__(timeoutid)
        ELEMENTS.forEach(updatePosition)
        if (ELEMENTS.size) timeoutid = __STO__(loop, 20)
      }
      observer = {} as any, observer.observe = loop, observer.unobserve = noop
      document.addEventListener('visibilitychange', () => {
        document.hidden ? __CTO__(timeoutid) : loop()
      }, false)
    }
  }

  return (target: any, cb: any, autostart = true): TypeUnlistener => {
    listen()
    cb = isArray(cb) ? cb.slice(0) : [cb]

    let item = ELEMENTS.get(target)!
    if (!item) {
      ELEMENTS.set(target, item = [[cb], target.offsetWidth, target.offsetHeight])
      observer.observe(target)
    } else item[0].push(cb)
    if (autostart) {
      for (let i = 0; i < cb.length; i++) cb[i]({ target, width: item[1], height: item[2] })
    }
    return (): void => {
      if (cb) {
        cb.length = 0, cb = null
        item![0].length < 2 && (ELEMENTS.delete(target), observer.unobserve(target))
      }
    }
  }
})()
