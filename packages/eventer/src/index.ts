// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  type TypeUnlistener = () => void

  type TypeCallback = (e: TypeDetail) => any
  type TypeCallbackKey = (e: KeyboardEvent) => any

  type TypeAddPointerEvent = (element: Element, type: string | string[], callback: TypeCallback | TypeCallback[])=> TypeUnlistener
    
  type TypeAddKeyboardEvent = (type: string | string[], callback: TypeCallbackKey | TypeCallbackKey[]) => TypeUnlistener

const isBrowser = typeof window !== 'undefined'

const noop = (): void => {}
const noopNoop = (): TypeUnlistener => noop
const isArray = Array.isArray
// const keys = Object.keys
  
const WSEVENTER = '__wseventer__'
  
const REG = /\((\w+)\)|([A-Z]\w+)|^([a-z]+)|(?<=\W)(?:([.\d]+)|(touch)|(mouse)|(stop)|(prevent)|(self)|(once)|(x|h\w*)|(y|v\w*)|([tu]\w*)|([bd]\w*)|(l\w*)|(r\w*))/g
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createItemData = (s: string) => {
  // @ts-ignore
  let type: TypeEvent = '', time = 0.5, sp, pt, sf, oe, x, y, u, d, l, r, th, me
  sp = pt = sf = oe = x = y = u = d = l = r = me = th = false
  let isKeys = 0
  const keys: { [key: string]: number } = {}
  s.replace(REG, (
    _f, _keyCode, _keyName, _type, _time, _touch, _mouse,
    _stop, _prevent, _self, _once,
    _x, _y, _u, _d, _l, _r
  ) => {
    if (_type) type = _type
    else if (_time) time = +_time || time
    else if (_stop) sp = !!_stop
    else if (_prevent) pt = !!_prevent
    else if (_self) sf = !!_self
    else if (_once) oe = !!_once
    else if (_x) x = !!_x
    else if (_y) y = !!_y
    else if (_u) u = !!_u
    else if (_d) d = !!_d
    else if (_l) l = !!_l
    else if (_r) r = !!_r
    else if (_touch) th = !!_touch
    else if (_mouse) me = !!_mouse
    else if (_keyCode || _keyName) isKeys++, keys[_keyCode || _keyName] = 1
    return ''
  })
  
  time *= 1000
  keys.len = isKeys
  const thme = th || me
  const xy = x || y || u || d || l || r
  const res = { type, time, sp, pt, sf, oe, xy, x, y, u, d, l, r, keys: isKeys ? keys : null, thme, th, me }
  // console.log(res)
  return res
}
  
let id = 1
  
  // type TypeTypes = typeof EVENTS.s | typeof EVENTS.m | typeof EVENTS.e
  type TypeEvent = typeof EVENTS[keyof typeof EVENTS]
  type TypeItemData = ReturnType<typeof createItemData>
  type TypeEventItem = [TypeItemData, Function[], { [key: string]: any }]
  
const EVENTS = {
  // eslint-disable-next-line object-property-newline
  s : 'start', m : 'move', e : 'end', t : 'tap', d : 'dbltap',
  // eslint-disable-next-line object-property-newline
  p : 'pan', h : 'hold', r : 'repeat',
  // eslint-disable-next-line object-property-newline
  fi: 'focusin', fo: 'focusout',
  // eslint-disable-next-line object-property-newline
  hi: 'hoverin', ho: 'hoverout',
  // eslint-disable-next-line object-property-newline 
  // se: 'swipe', ph: 'pinch'
} as const
  
const DIRECTIONS = { u: 'up', d: 'down', l: 'left', r: 'right' } as const
  
// onmousedown="return false" onselectstart="return false"

const KEY_CODES: { [key: string]: [string, string, number] } = {}
const KEY_BINDINGS: [any, Function[]][] = []

let listen = (): void => {
  listen = noop
  if (isBrowser) {
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
        for (let keys: TypeItemData['keys'], i = KEY_BINDINGS.length; i-- > 0;) {
          if (!(keys = KEY_BINDINGS[i][0]).len) KEY_BINDINGS.splice(i, 1)
          else if (keysequal(keys)) {
            for (let cbs = KEY_BINDINGS[i][1], j = cbs.length; j-- > 0;) cbs[j](e)
          }
        }
      }
    }

    const events = {
      mousedown : (e: MouseEvent): void => { mouseWrapper(e, EVENTS.s) },
      mousemove : (e: MouseEvent): void => { mouseWrapper(e, EVENTS.m) },
      mouseup   : (e: MouseEvent): void => { mouseWrapper(e, EVENTS.e) },
      touchstart: (e: TouchEvent): void => { touchWrapper(e, EVENTS.s) },
      touchmove : (e: TouchEvent): void => { touchWrapper(e, EVENTS.m) },
      touchend  : (e: TouchEvent): void => { touchWrapper(e, EVENTS.e) },
      keydown   : (e: any) => { keyWrapper(e, true) },
      keyup     : (e: any) => { keyWrapper(e, false) }
    } as const
    // @ts-ignore
    for (const event in events) document.addEventListener(event, events[event])
  }
}

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
    DETAIL_DIRECTION === DIRECTIONS.l && (data.x || data.l) ||
    DETAIL_DIRECTION === DIRECTIONS.r && (data.x || data.r) ||
    DETAIL_DIRECTION === DIRECTIONS.u && (data.y || data.u) ||
    DETAIL_DIRECTION === DIRECTIONS.d && (data.y || data.d)

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
  
let altKey = false, ctrlKey = false, metaKey = false, shiftKey = false
  
let IS_FIRST = false, IS_FINAL = false
let DETAIL_DIRECTION: string
let DETAIL_PAGE_X: number, DETAIL_PAGE_Y: number
// let DETAIL_DISTANCE_X: number, DETAIL_DISTANCE_Y: number
let DETAIL_OFFSET_X: number, DETAIL_OFFSET_Y: number
let DETAIL_DELTA_X: number, DETAIL_DELTA_Y: number
  type TypeDetail = ReturnType<typeof createDetail>
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createDetail = (type: TypeEvent, isMouse: boolean, e: any) => ({
  type: type,
  
  direction: DETAIL_DIRECTION,
  isFirst  : IS_FIRST,
  isFinal  : IS_FINAL,
  
  page  : { x: DETAIL_PAGE_X, y: DETAIL_PAGE_Y },
  delta : { x: DETAIL_DELTA_X, y: DETAIL_DELTA_Y },
  offset: { x: DETAIL_OFFSET_X, y: DETAIL_OFFSET_Y },
  // distance: { x: DETAIL_DISTANCE_X, y: DETAIL_DISTANCE_Y },
  
  key: { alt: altKey, ctrl: ctrlKey, meta: metaKey, shift: shiftKey },
  
  touch: !isMouse,
  mouse: isMouse,

  evt: e
})
  
let oldFocusIDS: { [key: string]: true } = {}
let oldHoverIDS: { [key: string]: true } = {}
let isPress = false
let target: Element
const STI: any[] = []
let focusedElement: Element
let hoveredElement: Element
let timer: number, timerStart: number, timerEnd: number
let _pageX = 0, _pageY = 0
let _deltaX = 0, _deltaY = 0
let _offsetX = 0, _offsetY = 0
let isFinal = false, isPaning = false
const directionXArr = [0, 0, 0, 0, 0, 0, 0]
const directionYArr = [0, 0, 0, 0, 0, 0, 0]
const createData = <M extends MouseEvent | TouchEvent>(
  e: MouseEvent | TouchEvent,
  type: typeof EVENTS.s | typeof EVENTS.m | typeof EVENTS.e,
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
  
  const { clientX, clientY, pageX, pageY } = (isMouse ? e
    : (e as TouchEvent).touches[0] ||
      { clientX: _deltaX, clientY: _deltaY, pageX: _pageX, pageY: _pageY }) as
      { clientX: number, clientY: number, pageX: number, pageY: number }
    
  isFinal = false
  const oldFocusedElement = focusedElement
  const oldHoveredElement = hoveredElement
  hoveredElement = target
  if (type === EVENTS.m) {
    if (isPress && !isPaning) isPaning = true
  } else {
    STI.forEach(clearInterval), STI.length = 0
    if (type === EVENTS.s) {
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
  // DETAIL_DISTANCE_X = abs(DETAIL_OFFSET_X)
  // DETAIL_DISTANCE_Y = abs(DETAIL_OFFSET_Y)
  const dist2 = (abs(DETAIL_OFFSET_X) + abs(DETAIL_OFFSET_Y)) * 1000
  
  directionXArr.push(DETAIL_DELTA_X), directionYArr.push(DETAIL_DELTA_Y)
  directionXArr.shift(), directionYArr.shift()
  const daltaX = sum(directionXArr), daltaY = sum(directionYArr)

  DETAIL_DIRECTION = abs(daltaX) > abs(daltaY)
    ? daltaX < 0 ? DIRECTIONS.l : DIRECTIONS.r
    : daltaY < 0 ? DIRECTIONS.u : DIRECTIONS.d
    
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
        // @ts-ignore
        if (wse = element[WSEVENTER]) {
          if (wse.id in oldFocusIDS) break
          for (let i = wse._.length; i-- > 0;) {
            item = wse._[i], data = item[0], event = data.type
            if (!event) wse._.splice(i, 1)
            else if (!data.thme || data.th === !isMouse && data.me === isMouse) {
              if (event === EVENTS.fi ||
              event === EVENTS.hi && needUpdateHover && !(wse.id in oldHoverIDS)) {
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
        // @ts-ignore
        if (wse = element[WSEVENTER]) {
          if (wse.id in oldHoverIDS) break
          for (let i = wse._.length; i-- > 0;) {
            item = wse._[i], data = item[0], event = data.type
            if (!event) wse._.splice(i, 1)
            else if (!data.thme || data.th === !isMouse && data.me === isMouse) {
              if (event === EVENTS.hi) each(item, event, isMouse, e)
            }
          }
        }
      } while (element = element.parentElement!)
    }
  }

  element = target
  do {
    // @ts-ignore
    if (wse = element[WSEVENTER]) {
      newFocusIDS[wse.id] = true
      newHoverIDS[wse.id] = true

      for (let i = wse._.length; i-- > 0;) {
        item = wse._[i], data = item[0], event = data.type, addition = item[2]
        if (!event) wse._.splice(i, 1)
        else if (!(event in STOPS) && (!data.sf || element === target)) {
          if (!data.thme || data.th === !isMouse && data.me === isMouse) {
            if (data.pt) e.preventDefault()
            if (data.sp) STOPS[event] = true, e.stopPropagation()
            switch (event) {
              // start, end, move
              case type:
                if (type !== EVENTS.m || alloyPanAndMove(data)) {
                  each(item, type, isMouse, e)
                }
                break
                // tap
              case EVENTS.t:
                if (type === EVENTS.e && timerEnd - timerStart < data.time) {
                  each(item, event, isMouse, e)
                }
                break
                // dbltap
              case EVENTS.d:
                if (type === EVENTS.e) {
                  if (timerEnd - addition.s > data.time) addition.is = 0
                  if (addition.is = ++addition.is | 0) {
                    if (addition.is === 1) addition.s = timerStart
                    else addition.is = 0, each(item, event, isMouse, e)
                  }
                }
                break
                // зажатие и джижение
                // pan
              case EVENTS.p:
                if (type === EVENTS.m && isPress || isFinal) {
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
              case EVENTS.h:
              case EVENTS.r:
                if (type === EVENTS.s) {
                  STI.push(addition.sti = setInterval(
                    (item, event, isMouse, e, add): void => {
                      event === EVENTS.h && clearInterval(add.sti)
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
        // @ts-ignore
        if (wse = element[WSEVENTER]) {
          if (wse.id in newFocusIDS) break
          for (let i = wse._.length; i-- > 0;) {
            item = wse._[i], data = item[0], event = data.type
            if (!event) wse._.splice(i, 1)
            else if (!data.thme || data.th === !isMouse && data.me === isMouse) {
              if (event === EVENTS.fo ||
              event === EVENTS.ho && needUpdateHover && !(wse.id in newHoverIDS)) {
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
        // @ts-ignore
        if (wse = element[WSEVENTER]) {
          if (wse.id in newHoverIDS) break
          for (let i = wse._.length; i-- > 0;) {
            item = wse._[i], data = item[0], event = data.type
            if (!event) wse._.splice(i, 1)
            else if (!data.thme || data.th === !isMouse && data.me === isMouse) {
              if (event === EVENTS.ho) each(item, event, isMouse, e)
            }
          }
        }
      } while (element = element.parentElement!)
    }
    oldHoverIDS = newHoverIDS
  }

  if (type === EVENTS.e) {
    _deltaX = clientX, _deltaY = clientY, _offsetX = _offsetY = 0
  }
}

const addTap = (
  el: Element, evt: string, cb: TypeCallback | TypeCallback[]
): TypeUnlistener => {
  const data = createItemData(evt)
  if (!data.type) throw evt
  // @ts-ignore
  const _ = (el[WSEVENTER] || (el[WSEVENTER] = { id: id++, _: [] }))._ as TypeEventItem[]
  const i = _.push([data, isArray(cb) ? cb.slice(0) : [cb], {}])
  // @ts-ignore
  const unsub = (): void => { data.type = '' }
  if (data.oe) _[i - 1][1].unshift(unsub)
  return unsub
}

const addKey = (
  evt: string, cb: TypeCallbackKey | TypeCallbackKey[]
): TypeUnlistener => {
  const data = createItemData(evt), keys = data.keys; if (!keys) throw evt
  const i = KEY_BINDINGS.push([keys, isArray(cb) ? cb.slice(0) : [cb]])
  const unsub = (): void => { keys.len = 0 }
  if (data.oe) KEY_BINDINGS[i - 1][1].unshift(unsub)
  return unsub
}

export const taps: TypeAddPointerEvent = !isBrowser ? noopNoop : (el, evt, cb): TypeUnlistener => {
  listen()
  let res = noop
  if (!isArray(evt)) {
    res = addTap(el, evt, cb)
  } else {
    const uns: TypeUnlistener[] = []
    for (let i = 0; i < evt.length; i++) uns.push(addTap(el, evt[i], cb))
    res = (): void => { for (;uns.length;) uns.pop()!() }
  }
  return res
}

export const keys: TypeAddKeyboardEvent = !isBrowser ? noopNoop : (evt, cb): TypeUnlistener => {
  listen()
  let res = noop
  if (!isArray(evt)) {
    res = addKey(evt, cb)
  } else {
    const uns: TypeUnlistener[] = []
    for (let i = 0; i < evt.length; i++) uns.push(addKey(evt[i], cb))
    res = (): void => { for (;uns.length;) uns.pop()!() }
  }
  return res
}

export const untaps = !isBrowser ? noop : (el: Element): void => {
  // @ts-ignore
  if (el && WSEVENTER in el) delete el[WSEVENTER]
}

export default { taps, keys, untaps }
