/* eslint-disable no-loop-func */
import { TypeElement, TypeUnlistener, TypeEventSettings } from '.'
import {
  __WSE__,
  addEvent, delEvent,
  isBrowser, noop, noopNoop,
  isArray, isPointers,
  getEventSettings, preventDefault,
  wrap_base, wrap_keys, wrap_self, wrap_trusted
} from '.'

export declare type TypeCursorEvent = {
  type : string,
  target: Element,
  direction: string,

  isFirst: boolean,
  isFinal: boolean,

  page : { x: number, y: number },
  delta : { x: number, y: number },
  offset: { x: number, y: number },
  client: { x: number, y: number },
  screen: { x: number, y: number },

  isTrusted: boolean,
  event : PointerEvent,
}
export declare type TypeCursorEventListener = (e: TypeCursorEvent) => void
export declare type TypeCursor = (
  target: Element, event: string | string[],
  listeners?: TypeCursorEventListener | TypeCursorEventListener[],
) => TypeUnlistener

export const cursor = ((): TypeCursor => {
  if (!isBrowser) return noopNoop

  const __composedPath__ = (e: Event): Element[] => {
    const res: any[] = []
    let el = e.target as Node
    do { res.push(el) } while (el = el.parentNode as any)
    res.push(window)
    return res
  }

  const __abs__ = (n: number): number => n < 0 ? -n : n
  const __sum__ = (a: number[]): number => {
    let res = 0
    for (let i = a.length; i-- > 0;) res += a[i]
    return res
  }

  const alloyPanAndMove = (data: TypeEventSettings): boolean =>
    !data.xy ||
    DIRECTION === DIRECTION_L && (data.x || data.l) ||
    DIRECTION === DIRECTION_R && (data.x || data.r) ||
    DIRECTION === DIRECTION_U && (data.y || data.u) ||
    DIRECTION === DIRECTION_D && (data.y || data.d)

  const checkSelect = !isBrowser ? noop
    : window.getSelection ? (): void => { window.getSelection()!.removeAllRanges() }
      // @ts-ignore
      : (): void => { document.selection.empty() }
      
  const __WSEHOVERS__ = '__hovers__'
  const __WSECURSOR__ = '__cursor__'
  const __WSESIMPLE__ = '__simple__'

  const EVENT_START = 'start', EVENT_MOVE = 'move', EVENT_END = 'end'
  const EVENT_CLICK = 'click', EVENT_DBLCLICK = 'dblclick'
  const EVENT_PAN = 'pan', EVENT_PRESS = 'press', EVENT_REPEAT = 'repeat'

  const EVENT_HOVER_IN = 'hoverin', EVENT_HOVER_OUT = 'hoverout'
  const EVENT_FOCUS_IN = 'focusin', EVENT_FOCUS_OUT = 'focusout'

  const DIRECTION_U = 'up', DIRECTION_D = 'down'
  const DIRECTION_L = 'left', DIRECTION_R = 'right'

  type TypeSimple = typeof EVENT_START | typeof EVENT_MOVE | typeof EVENT_END
  type TypeHovers =
    typeof EVENT_HOVER_IN | typeof EVENT_HOVER_OUT |
    typeof EVENT_FOCUS_IN | typeof EVENT_FOCUS_OUT

  let target: any

  const createDetail = (type: string, event: any): TypeCursorEvent => ({
    type     : type,
    target,
    direction: DIRECTION,

    isFirst: IS_FIRST,
    isFinal: IS_FINAL,

    page  : { x: _pageX, y: _pageY },
    delta : { x: _deltaX, y: _deltaY },
    offset: { x: _offsetX, y: _offsetY },
    client: { x: _clientX, y: _clientY },
    screen: { x: _screenX, y: _screenY },

    isTrusted: event.isTrusted,
    event    : event,
  })

  const runHovers = (el: any, type: TypeHovers, event: any): void => {
    if (__WSE__ in el && __WSEHOVERS__ in el[__WSE__] &&
      type in el[__WSE__][__WSEHOVERS__]) {
      const items = el[__WSE__][__WSEHOVERS__][type]
      for (let fns: Function[], i = 0; fns = items[i], i < items.length; i++) {
        for (let j = 0; j < fns.length; j++) fns[j](createDetail(type, event))
        if (!fns.length) items.splice(i--, 1)
      }
      if (!items.length) delete el[__WSE__][__WSEHOVERS__][type]
    }
  }

  let DIRECTION: string
  let IS_FIRST = false, IS_FINAL = false
  let _clientX = 0, _clientY = 0, _screenX = 0, _screenY = 0,
    _pageX = 0, _pageY = 0, _offsetX = 0, _offsetY = 0, _deltaX = 0, _deltaY = 0
  const directionXArr = [0, 0, 0, 0, 0]
  const directionYArr = [0, 0, 0, 0, 0]

  let timer: number, timerStart: number, timerEnd: number
  let isFinal = false, isPaning = false, isPress = false
  const STI: any[] = []

  let lastHovered = {} as Element
  let lastFocused = {} as Element
  let lastHoveredList: Element[] = []
  let lastFocusedList: Element[] = []
  let lastStarted = {} as Element
  const update = (
    e: MouseEvent | TouchEvent, headtype: TypeSimple, isMouse: boolean
  ): void => {
    // console.log(e)
    // @ts-ignore
    if (!isMouse && e.touches.length !== 1) return

    const nextHovered = target = e.target as Element
    const nextFocused = headtype !== EVENT_MOVE ? nextHovered : lastFocused

    const needUpdateHovered = lastHovered !== nextHovered
    const needUpdateFocused = lastFocused !== nextFocused

    // @ts-ignore
    const { clientX, clientY, pageX, pageY, screenX, screenY } = isMouse ? e
      : (e as TouchEvent).touches[0] ||
      { clientX: _clientX, clientY: _clientY, pageX: _pageX, pageY: _pageY, screenX: _screenX, screenY: _screenY }

    timer = e.timeStamp
      
    isFinal = false
    if (headtype === EVENT_MOVE) {
      if (isPress && !isPaning) isPaning = true
    } else {
      STI.forEach(clearInterval), STI.length = 0
      if (headtype === EVENT_START) {
        lastStarted = target
        isPress = true
        timerStart = timer
        _clientX = clientX, _clientY = clientY, _offsetX = _offsetY = 0
      } else {
        isPress = false
        timerEnd = timer
        if (isPaning) isPaning = !(isFinal = true)
      }
    }

    // не меняй их местами
    _deltaX = -_clientX + (_clientX = clientX)
    _deltaY = -_clientY + (_clientY = clientY)
    _offsetX += _deltaX, _offsetY += _deltaY
    _screenX = screenX, _screenY = screenY
    _pageX = pageX, _pageY = pageY

    const dist2 = (__abs__(_offsetX) + __abs__(_offsetY)) * 1000

    directionXArr.shift(), directionYArr.shift()
    directionXArr.push(_deltaX), directionYArr.push(_deltaY)
    const dirX = __sum__(directionXArr), dirY = __sum__(directionYArr)
    DIRECTION = __abs__(dirX) > __abs__(dirY)
      ? dirX < 0 ? DIRECTION_L : DIRECTION_R
      : dirY < 0 ? DIRECTION_U : DIRECTION_D

    if (needUpdateHovered || needUpdateFocused) {
      const path = (e.composedPath && e.composedPath() ||
        __composedPath__(e)) as Element[]
      const pathlen = path.length - 2

      if (needUpdateHovered) {
        lastHovered = nextHovered
        const nextHoveredList = path

        let nhi = pathlen
        let lhi = lastHoveredList.length - 2
        for (;;) {
          if (nextHoveredList[nhi] === lastHoveredList[lhi]) nhi--, lhi--
          else break
        }
        for (;lhi >= 0; lhi--) runHovers(lastHoveredList[lhi], EVENT_HOVER_OUT, e)
        for (;nhi >= 0; nhi--) runHovers(nextHoveredList[nhi], EVENT_HOVER_IN, e)
        lastHoveredList = nextHoveredList
      }

      if (needUpdateFocused) {
        lastFocused = nextFocused
        const nextFocusedList = path

        let nfi = pathlen
        let lfi = lastFocusedList.length - 2
        for (;;) {
          if (nextFocusedList[nfi] === lastFocusedList[lfi]) nfi--, lfi--
          else break
        }
        for (;lfi >= 0; lfi--) runHovers(lastFocusedList[lfi], EVENT_FOCUS_OUT, e)
        for (;nfi >= 0; nfi--) runHovers(nextFocusedList[nfi], EVENT_FOCUS_IN, e)
        lastFocusedList = nextFocusedList
      }
    }

    const STOPS: any = {}
    let element: any, wsec: any[], item: any,
      es: TypeEventSettings, callback: Function, addition: any, type: string

    for (element = target; element; element = element.parentNode) {
      if (__WSE__ in element && __WSESIMPLE__ in element[__WSE__]) {
        wsec = element[__WSE__][__WSESIMPLE__]
        for (let i = 0; i < wsec.length; i++) {
          if ((item = wsec[i])[1] === noop) {
            wsec.splice(i--, 1)
            if (!wsec.length) {
              delete element[__WSE__][__WSESIMPLE__]
              if (!(__WSECURSOR__ in element[__WSE__])) delGlobalPreventDefault(element)
            }
          } else if (!((type = (es = item[0]).type) in STOPS)) {
            if (es.stop) STOPS[type] = true
            callback = item[1], addition = item[2]

            if (headtype !== EVENT_MOVE || alloyPanAndMove(es)) {
              callback(createDetail(type, e))
            }
          }
        }
      }
    }
    for (element = lastStarted; element; element = element.parentNode) {
      if (__WSE__ in element && __WSECURSOR__ in element[__WSE__]) {
        wsec = element[__WSE__][__WSECURSOR__]
        for (let i = 0; i < wsec.length; i++) {
          if ((item = wsec[i])[1] === noop) {
            wsec.splice(i--, 1)
            if (!wsec.length) {
              delete element[__WSE__][__WSECURSOR__]
              if (!(__WSESIMPLE__ in element[__WSE__])) delGlobalPreventDefault(element)
            }
          } else if (!((type = (es = item[0]).type) in STOPS)) {
            if (es.stop) STOPS[type] = true
            callback = item[1], addition = item[2]

            switch (type) {
              case EVENT_CLICK:
                if (headtype === EVENT_END && timerEnd - timerStart < es.num) {
                  callback(createDetail(type, e))
                }
                break
              case EVENT_DBLCLICK:
                if (headtype === EVENT_END) {
                  if (timerEnd - addition.s > es.num) addition.is = 0
                  if (addition.is = ++addition.is | 0) {
                    if (addition.is === 1) addition.s = timerStart
                    else addition.is = 0, callback(createDetail(type, e))
                  }
                }
                break
              case EVENT_PAN:
                if (headtype === EVENT_MOVE && isPress || isFinal) {
                  if (isFinal && addition.is ||
                    dist2 > es.num && alloyPanAndMove(es)) {
                    if (IS_FINAL = isFinal) addition.is = false
                    else if (!addition.is) IS_FIRST = addition.is = true
                    checkSelect(), callback(createDetail(type, e))
                    IS_FIRST = IS_FINAL = false
                  }
                }
                break
              case EVENT_PRESS:
              case EVENT_REPEAT:
                if (headtype === EVENT_START) {
                  STI.push(addition.sti = setInterval(
                    (type, e, add): void => {
                      type === EVENT_PRESS && clearInterval(add.sti)
                      checkSelect(), callback(createDetail(type, e))
                    }, es.num, type, e, addition
                  ))
                }
                break
              default:
                // throw type
            }
          }
        }
      }
    }

    // console.log(e.path, e.composedPath(), composedPath(e))

    if (headtype === EVENT_END) {
      _clientX = clientX, _clientY = clientY, _offsetX = _offsetY = 0
    }
  }

  let obj: any
  if (isPointers) {
    obj = {
      pointerdown  : (e: any): void => { update(e, EVENT_START, true) },
      pointermove  : (e: any): void => { update(e, EVENT_MOVE, true) },
      pointerup    : (e: any): void => { update(e, EVENT_END, true) },
      pointercancel: (e: any): void => { update(e, EVENT_END, true) },
    }
  } else {
    // For bug in dev tools
    let __type__ = 0
    const mouseWrapper = (e: any, type: any): void => {
      ++__type__ >= (__type__ = 1) && update(e, type, true)
    }
    const touchWrapper = (e: any, type: any): void => {
      --__type__ <= (__type__ = -1) && update(e, type, false)
    }
    obj = {
      mousedown  : (e: any): void => { mouseWrapper(e, EVENT_START) },
      mousemove  : (e: any): void => { mouseWrapper(e, EVENT_MOVE) },
      mouseup    : (e: any): void => { mouseWrapper(e, EVENT_END) },
      touchstart : (e: any): void => { touchWrapper(e, EVENT_START) },
      touchmove  : (e: any): void => { touchWrapper(e, EVENT_MOVE) },
      touchend   : (e: any): void => { touchWrapper(e, EVENT_END) },
      touchcancel: (e: any): void => { touchWrapper(e, EVENT_END) },
    }
  }

  const EVENTS_FOR_RESET = ['click', 'dblclick']
  for (const event in obj) {
    addEvent(document, event, obj[event], false), EVENTS_FOR_RESET.push(event)
  }
  const setGlobalPreventDefault = (el: TypeElement): void => {
    for (let i = 0; i < EVENTS_FOR_RESET.length; i++) {
      addEvent(el, EVENTS_FOR_RESET[i], preventDefault, { passive: false })
    }
  }
  const delGlobalPreventDefault = (el: TypeElement): void => {
    for (let i = 0; i < EVENTS_FOR_RESET.length; i++) {
      delEvent(el, EVENTS_FOR_RESET[i], preventDefault)
    }
  }

  const cursor = (
    target: Element, event: string | string[],
    listeners: TypeCursorEventListener | TypeCursorEventListener[]
  ): TypeUnlistener => {
    let unsub: TypeUnlistener

    if (!isArray(event)) {
      // @ts-ignore
      const fns = [].concat(listeners) as any[]
      // @ts-ignore
      const wse = target[__WSE__] || (target[__WSE__] = {})
      const es = getEventSettings(event)
      
      const TYPE = es.type

      let isSimple = false
      switch (TYPE) {
        case EVENT_HOVER_IN:
        case EVENT_HOVER_OUT:
        case EVENT_FOCUS_IN:
        case EVENT_FOCUS_OUT: {
          unsub = (): void => { fns.length = 0 }
          if (es.once) fns.push(unsub)
          const wseh = wse[__WSEHOVERS__] || (wse[__WSEHOVERS__] = {})
          TYPE in wseh ? wseh[TYPE].push(fns) : wseh[TYPE] = [fns]
          break
        }
        case EVENT_START:
        case EVENT_MOVE:
        // @ts-ignore
        // eslint-disable-next-line no-fallthrough
        case EVENT_END:
          isSimple = true
        // eslint-disable-next-line no-fallthrough
        case EVENT_CLICK:
        case EVENT_DBLCLICK:
        case EVENT_PAN:
        case EVENT_PRESS:
        case EVENT_REPEAT: {
          unsub = (): void => { fns.length = 0, item[1] = noop }
          let cb = wrap_base(fns)
          if (es.once) fns.push(unsub)
          if (es.kLen) cb = wrap_keys(cb, es)
          if (es.self) cb = wrap_self(cb)
          if (es.trusted) cb = wrap_trusted(cb)
          const item = [es, cb, {}]
          const OBJ = isSimple ? __WSESIMPLE__ : __WSECURSOR__
          if (!(__WSESIMPLE__ in wse || __WSECURSOR__ in wse)) {
            setGlobalPreventDefault(target as any)
          }
          OBJ in wse ? wse[OBJ].push(item) : wse[OBJ] = [item]
          break
        }
        default:
          throw event
      }

      // console.log(es)
      // type in wse ? wse[type].push(item) : wse[type] = [item]
    } else {
      const unsubs: TypeUnlistener[] = []
      unsub = (): void => { for (;unsubs.length;) unsubs.pop()!() }
      for (let i = 0; i < event.length; i++) unsubs.push(cursor(target, event[i], listeners))
    }
    return unsub
  }

  return cursor as any
})()
