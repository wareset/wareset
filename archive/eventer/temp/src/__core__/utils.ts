import { TypeEvent } from '.'

export const isBrowser = typeof window !== 'undefined'

export const noop = (): void => { }
export const noopNoop = (): (() => void) => noop

export const isArray = Array.isArray

export type TypeItemData = ReturnType<typeof createItemData>
const REG = /\((\w+)\)|([A-Z]\w+)|^([a-z]+)|(?<=\W)(?:([.\d]+)|(touch)|(mouse)|(stop)|(prevent)|(self)|(once)|(x|h\w*)|(y|v\w*)|([tu]\w*)|([bd]\w*)|(l\w*)|(r\w*))/g
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createItemData = (s: string) => {
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
