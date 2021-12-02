import {
  contextmenu,
  mousedown,
  mousemove,
  mouseup,
  touchstart,
  touchmove,
  touchend
} from '.'

const __addEventListener__ = (
  type: string,
  listener: (evt: Event) => void
): void => {
  document.addEventListener(type, listener)
}

export const listen = (): void => {
  __addEventListener__('contextmenu', contextmenu as any)

  __addEventListener__('mousedown', mousedown as any)
  __addEventListener__('mousemove', mousemove as any)
  __addEventListener__('mouseup', mouseup as any)

  __addEventListener__('touchstart', touchstart as any)
  __addEventListener__('touchmove', touchmove as any)
  __addEventListener__('touchend', touchend as any)
  __addEventListener__('touchcancel', touchend as any)
}
