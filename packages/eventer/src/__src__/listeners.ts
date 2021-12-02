let __type__ = 0

export const contextmenu = (_e: MouseEvent): void => {
  if (++__type__ >= (__type__ = 1)) {
    console.log(_e)
  }
}

export const mousedown = (_e: MouseEvent): void => {
  if (++__type__ >= (__type__ = 1)) {
    console.log(_e)
  }
}
export const mousemove = (_e: MouseEvent): void => {
  if (++__type__ >= (__type__ = 1)) {
    console.log(_e)
  }
}
export const mouseup = (_e: MouseEvent): void => {
  if (++__type__ >= (__type__ = 1)) {
    console.log(_e)
  }
}

export const touchstart = (_e: TouchEvent): void => {
  if (--__type__ <= (__type__ = -1)) {
    console.log(_e)
  }
}
export const touchmove = (_e: TouchEvent): void => {
  if (--__type__ <= (__type__ = -1)) {
    console.log(_e)
  }
}
export const touchend = (_e: TouchEvent): void => {
  if (--__type__ <= (__type__ = -1)) {
    console.log(_e)
  }
}
