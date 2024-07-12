// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

import { TypeUnlistener, TypeEvent } from '.'
import { isBrowser, noop, noopNoop, isArray } from '.'
import { createItemData, TypeItemData } from '.'
import { KEY_BINDINGS } from '.'

export type TypeCursorEvent = ReturnType<typeof createDetail>
export type TypeCursorCallback = (e: TypeCursorEvent) => any
export type TypeAddCursorEvent = (element: Element, type: string | string[], callback: TypeCursorCallback | TypeCursorCallback[]) => TypeUnlistener

type TypeEventItem = [TypeItemData, Function[], { [key: string]: any }]

let id = 1
const EVENTERS: Map<Element, any> = new Map()

let DETAIL_DIRECTION: string
let IS_FIRST = false, IS_FINAL = false
let DETAIL_PAGE_X: number, DETAIL_PAGE_Y: number
let DETAIL_CLIENT_X: number, DETAIL_CLIENT_Y: number
let DETAIL_SCREEN_X: number, DETAIL_SCREEN_Y: number
let DETAIL_DELTA_X: number, DETAIL_DELTA_Y: number
let DETAIL_OFFSET_X: number, DETAIL_OFFSET_Y: number
let altKey = false, ctrlKey = false, metaKey = false, shiftKey = false

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createDetail = (type: TypeEvent, isMouse: boolean, e: any) => ({
  type: type,

  direction: DETAIL_DIRECTION,
  isFirst  : IS_FIRST,
  isFinal  : IS_FINAL,

  page  : { x: DETAIL_PAGE_X, y: DETAIL_PAGE_Y },
  client: { x: DETAIL_CLIENT_X, y: DETAIL_CLIENT_Y },
  screen: { x: DETAIL_SCREEN_X, y: DETAIL_SCREEN_Y },
  delta : { x: DETAIL_DELTA_X, y: DETAIL_DELTA_Y },
  offset: { x: DETAIL_OFFSET_X, y: DETAIL_OFFSET_Y },

  key: { alt: altKey, ctrl: ctrlKey, meta: metaKey, shift: shiftKey },

  touch: !isMouse,
  mouse: isMouse,

  event: e
})

export const listen = [(): void => {
  if (listen[0] !== (listen[0] = noop) && isBrowser) {
    const KEY_CODES: { [key: string]: [string, string, number] } = {}

    const EVENT_START = 'start', EVENT_MOVE = 'move', EVENT_END = 'end'
    const EVENT_TAP = 'tap', EVENT_DBLTAP = 'dbltap'
    const EVENT_PAN = 'pan', EVENT_HOLD = 'hold', EVENT_REPEAT = 'repeat'
    const EVENT_FI = 'focusin', EVENT_FO = 'focusout'
    const EVENT_HI = 'hoverin', EVENT_HO = 'hoverout'

    const DIRECTION_U = 'up', DIRECTION_D = 'down', DIRECTION_L = 'left', DIRECTION_R = 'right'

    const keysequal = (o: any): boolean => {
      let n = o.len
      for (const k in KEY_CODES) {
        if (KEY_CODES[k][0] in o || KEY_CODES[k][1] in o || KEY_CODES[k][2] in o) n--
        else break
      }
      return !n
    }

    const alloyPanAndMove = (data: any): boolean =>
      !data.xy ||
      DETAIL_DIRECTION === DIRECTION_L && (data.x || data.l) ||
      DETAIL_DIRECTION === DIRECTION_R && (data.x || data.r) ||
      DETAIL_DIRECTION === DIRECTION_U && (data.y || data.u) ||
      DETAIL_DIRECTION === DIRECTION_D && (data.y || data.d)

    const checkSelect = !isBrowser ? noop
      : window.getSelection ? (): void => { window.getSelection()!.removeAllRanges() }
        // @ts-ignore
        : (): void => { document.selection.empty() }

    const abs = (n: number): number => n < 0 ? -n : n
    const sum = (a: number[]): number => {
      let res = 0
      for (let i = a.length; i-- > 0;) res += a[i]
      return res
    }

    const each = (
      item: TypeEventItem, type: TypeEvent, isMouse: boolean, e: any
    ): void => {
      const data = item[0]
      if (!data.keys || keysequal(data.keys)) {
        for (let i = 0; i < item[1].length; i++) item[1][i](createDetail(type, isMouse, e))
      }
    }

    let oldFocusIDS: { [key: string]: true } = {}
    let oldHoverIDS: { [key: string]: true } = {}
    let isPress = false
    let target: Element
    const STI: any[] = []
    let focusedElement: Element
    let hoveredElement: Element
    let timer: number, timerStart: number, timerEnd: number
    let _pageX = 0, _pageY = 0
    let _screenX = 0, _screenY = 0
    let _deltaX = 0, _deltaY = 0
    let _offsetX = 0, _offsetY = 0
    let isFinal = false, isPaning = false
    const directionXArr = [0, 0, 0, 0, 0]
    const directionYArr = [0, 0, 0, 0, 0]
    const createData = <M extends MouseEvent | TouchEvent>(
      e: MouseEvent | TouchEvent,
      type: typeof EVENT_START | typeof EVENT_MOVE | typeof EVENT_END,
      isMouse: M extends MouseEvent ? true : false
    ): void => {
      // console.log(e)
      // @ts-ignore
      target = e.target
      timer = e.timeStamp

      altKey = !!e.altKey
      ctrlKey = !!e.ctrlKey
      metaKey = !!e.metaKey
      shiftKey = !!e.shiftKey

      const { clientX, clientY, pageX, pageY, screenX, screenY } = (isMouse ? e
        : (e as TouchEvent).touches[0] ||
        { clientX: _deltaX, clientY: _deltaY, pageX: _pageX, pageY: _pageY, screenX: _screenX, screenY: _screenY }) as
        { clientX: number, clientY: number, pageX: number, pageY: number, screenX: number, screenY: number }

      isFinal = false
      const oldFocusedElement = focusedElement
      const oldHoveredElement = hoveredElement
      hoveredElement = target
      if (type === EVENT_MOVE) {
        if (isPress && !isPaning) isPaning = true
      } else {
        STI.forEach(clearInterval), STI.length = 0
        if (type === EVENT_START) {
          focusedElement = target
          isPress = true
          timerStart = timer
          _deltaX = clientX, _deltaY = clientY, _offsetX = _offsetY = 0
        } else {
          isPress = false
          timerEnd = timer
          if (isPaning) isPaning = !(isFinal = true)
        }
      }

      // не меняй их местами
      DETAIL_DELTA_X = -_deltaX + (_deltaX = clientX)
      DETAIL_DELTA_Y = -_deltaY + (_deltaY = clientY)
      DETAIL_OFFSET_X = _offsetX += DETAIL_DELTA_X
      DETAIL_OFFSET_Y = _offsetY += DETAIL_DELTA_Y
      DETAIL_PAGE_X = _pageX = pageX, DETAIL_PAGE_Y = _pageY = pageY
      DETAIL_CLIENT_X = clientX, DETAIL_CLIENT_Y = clientY
      DETAIL_SCREEN_X = _screenX = screenX, DETAIL_SCREEN_Y = _screenY = screenY
      const dist2 = (abs(DETAIL_OFFSET_X) + abs(DETAIL_OFFSET_Y)) * 1000

      directionXArr.push(DETAIL_DELTA_X), directionYArr.push(DETAIL_DELTA_Y)
      directionXArr.shift(), directionYArr.shift()
      const daltaX = sum(directionXArr), daltaY = sum(directionYArr)

      DETAIL_DIRECTION = abs(daltaX) > abs(daltaY)
        ? daltaX < 0 ? DIRECTION_L : DIRECTION_R
        : daltaY < 0 ? DIRECTION_U : DIRECTION_D

      // @ts-ignore
      // document.body.children[0].children[0].childNodes[0].data = JSON.stringify(createDetail(type, isMouse, e), null, 2)
      // div.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`

      const needUpdateFocus = oldFocusedElement !== focusedElement
      const needUpdateHover = oldHoveredElement !== hoveredElement

      const newFocusIDS: { [key: string]: true } = {}
      const newHoverIDS: { [key: string]: true } = {}
      let wse: any
      let element: Element
      const STOPS: any = {}
      let item: TypeEventItem, data: TypeItemData, event: TypeEvent, addition: any

      if (needUpdateFocus) {
        if (element = focusedElement) {
          do {
            if (wse = EVENTERS.get(element)) {
              if (wse.id in oldFocusIDS) break
              for (let i = 0; i < wse._.length; i++) {
                item = wse._[i], data = item[0], event = data.type
                if (!event) wse._.splice(i--, 1)
                else if (!data.thme || data.th === !isMouse && data.me === isMouse) {
                  if (event === EVENT_FI ||
                    event === EVENT_HI && needUpdateHover && !(wse.id in oldHoverIDS)) {
                    each(item, event, isMouse, e)
                  }
                }
              }
            }
          } while (element = element.parentElement!)
        }
      } else if (needUpdateHover) {
        if (element = hoveredElement) {
          do {
            if (wse = EVENTERS.get(element)) {
              if (wse.id in oldHoverIDS) break
              for (let i = 0; i < wse._.length; i++) {
                item = wse._[i], data = item[0], event = data.type
                if (!event) wse._.splice(i--, 1)
                else if (!data.thme || data.th === !isMouse && data.me === isMouse) {
                  if (event === EVENT_HI) each(item, event, isMouse, e)
                }
              }
            }
          } while (element = element.parentElement!)
        }
      }

      element = target
      do {
        if (wse = EVENTERS.get(element)) {
          newFocusIDS[wse.id] = true
          newHoverIDS[wse.id] = true

          for (let i = 0; i < wse._.length; i++) {
            item = wse._[i], data = item[0], event = data.type, addition = item[2]
            if (!event) wse._.splice(i--, 1)
            else if (!(event in STOPS) && (!data.sf || element === target)) {
              if (!data.thme || data.th === !isMouse && data.me === isMouse) {
                if (data.pt) e.preventDefault()
                if (data.sp) STOPS[event] = true, e.stopPropagation()
                switch (event) {
                  // start, end, move
                  case type:
                    if (type !== EVENT_MOVE || alloyPanAndMove(data)) {
                      each(item, type, isMouse, e)
                    }
                    break
                  // tap
                  case EVENT_TAP:
                    if (type === EVENT_END && timerEnd - timerStart < data.time) {
                      each(item, event, isMouse, e)
                    }
                    break
                  // dbltap
                  case EVENT_DBLTAP:
                    if (type === EVENT_END) {
                      if (timerEnd - addition.s > data.time) addition.is = 0
                      if (addition.is = ++addition.is | 0) {
                        if (addition.is === 1) addition.s = timerStart
                        else addition.is = 0, each(item, event, isMouse, e)
                      }
                    }
                    break
                  // зажатие и джижение
                  // pan
                  case EVENT_PAN:
                    if (type === EVENT_MOVE && isPress || isFinal) {
                      if (isFinal && addition.is ||
                        dist2 > data.time && alloyPanAndMove(data)) {
                        if (IS_FINAL = isFinal) addition.is = false
                        else if (!addition.is) IS_FIRST = addition.is = true
                        checkSelect(), each(item, event, isMouse, e)
                        IS_FIRST = IS_FINAL = false
                      }
                    }
                    break
                  // зажатие и удержание. сработает после нескольких секунд
                  // hold / repeat
                  case EVENT_HOLD:
                  case EVENT_REPEAT:
                    if (type === EVENT_START) {
                      STI.push(addition.sti = setInterval(
                        (item, event, isMouse, e, add): void => {
                          event === EVENT_HOLD && clearInterval(add.sti)
                          checkSelect(), each(item, event, isMouse, e)
                        }, data.time, item, event, isMouse, e, addition
                      ))
                    }
                    break
                  default:
                  // console.warn(WSEVENTER + ' - not correct event: ' + event)
                }
              }
            }
          }
        }
      } while (element = element.parentElement!)

      if (needUpdateFocus) {
        if (element = oldFocusedElement) {
          do {
            if (wse = EVENTERS.get(element)) {
              if (wse.id in newFocusIDS) break
              for (let i = 0; i < wse._.length; i++) {
                item = wse._[i], data = item[0], event = data.type
                if (!event) wse._.splice(i--, 1)
                else if (!data.thme || data.th === !isMouse && data.me === isMouse) {
                  if (event === EVENT_FO ||
                    event === EVENT_HO && needUpdateHover && !(wse.id in newHoverIDS)) {
                    each(item, event, isMouse, e)
                  }
                }
              }
            }
          } while (element = element.parentElement!)
        }
        oldFocusIDS = newFocusIDS, oldHoverIDS = newHoverIDS
      } else if (needUpdateHover) {
        if (element = oldHoveredElement) {
          do {
            if (wse = EVENTERS.get(element)) {
              if (wse.id in newHoverIDS) break
              for (let i = 0; i < wse._.length; i++) {
                item = wse._[i], data = item[0], event = data.type
                if (!event) wse._.splice(i--, 1)
                else if (!data.thme || data.th === !isMouse && data.me === isMouse) {
                  if (event === EVENT_HO) each(item, event, isMouse, e)
                }
              }
            }
          } while (element = element.parentElement!)
        }
        oldHoverIDS = newHoverIDS
      }

      if (type === EVENT_END) {
        _deltaX = clientX, _deltaY = clientY, _offsetX = _offsetY = 0
      }
    }

    let __type__ = 0
    const mouseWrapper = (e: MouseEvent, type: any): void => {
      ++__type__ >= (__type__ = 1) && createData(e, type, true)
    }
    const touchWrapper = (e: TouchEvent, type: any): void => {
      --__type__ <= (__type__ = -1) && createData(e, type, false)
    }
    // export const contextmenu = (_e: MouseEvent): void => {
    //   _e.preventDefault()
    //   mouseWrapper(_e, START)
    // }
    const keyWrapper = (e: KeyboardEvent, value: boolean): void => {
      // console.log(e)
      const code = e.code, key = e.key
      if (value) KEY_CODES[code + key] = [code, key, e.keyCode]
      else delete KEY_CODES[code + key]

      if (value) {
        for (let cbs: Function[], i = 0; i < KEY_BINDINGS.length; i++) {
          if (!(cbs = KEY_BINDINGS[i][1]).length) KEY_BINDINGS.splice(i--, 1)
          else if (keysequal(KEY_BINDINGS[i][0])) {
            for (let j = 0; j < cbs.length; i++) cbs[j](e)
          }
        }
      }
    }

    const events = {
      mousedown : (e: MouseEvent): void => { mouseWrapper(e, EVENT_START) },
      mousemove : (e: MouseEvent): void => { mouseWrapper(e, EVENT_MOVE) },
      mouseup   : (e: MouseEvent): void => { mouseWrapper(e, EVENT_END) },
      touchstart: (e: TouchEvent): void => { touchWrapper(e, EVENT_START) },
      touchmove : (e: TouchEvent): void => { touchWrapper(e, EVENT_MOVE) },
      touchend  : (e: TouchEvent): void => { touchWrapper(e, EVENT_END) },
      keydown   : (e: any) => { keyWrapper(e, true) },
      keyup     : (e: any) => { keyWrapper(e, false) }
    } as const
    // @ts-ignore
    events.touchcancel = events.touchend
    for (const event in events) {
      // @ts-ignore
      document.addEventListener(event, events[event])
      if (event[0] !== 'k') EVENTTYPES.push(event)
    }
  }
}]

const EVENTTYPES: string[] = ['click', 'dblclick']
const globalPreventDefault = (e: any): void => { e.preventDefault() }
const setGlobalPreventDefault = (el: Element): void => {
  for (let i = 0; i < EVENTTYPES.length; i++) {
    el.addEventListener(EVENTTYPES[i], globalPreventDefault, { passive: false })
  }
}
const delGlobalPreventDefault = (el: Element): void => {
  for (let i = 0; i < EVENTTYPES.length; i++) {
    el.removeEventListener(EVENTTYPES[i], globalPreventDefault)
  }
}

export const cursor: TypeAddCursorEvent = !isBrowser ? noopNoop : (el, evt, cb): TypeUnlistener => {
  let unsub = noop
  if (!isArray(evt)) {
    listen[0]()
    const data = createItemData(evt)
    if (!data.type) throw evt
    let item = EVENTERS.get(el)
    if (!item) EVENTERS.set(el, item = { id: id++, _: [] }), setGlobalPreventDefault(el)
    const _ = item._ as TypeEventItem[]
    const cbs = isArray(cb) ? cb.slice(0) : [cb]
    const i = _.push([data, cbs, {}])
    unsub = (): void => {
      data.type = '' as any, cbs.length = 0
      if (_.length < 2) EVENTERS.delete(el), delGlobalPreventDefault(el)
    }
    if (data.oe) _[i - 1][1].push(unsub)
  } else {
    const uns: TypeUnlistener[] = []
    for (let i = 0; i < evt.length; i++) uns.push(cursor(el, evt[i], cb))
    unsub = (): void => { for (; uns.length;) uns.pop()!() }
  }
  return unsub
}
