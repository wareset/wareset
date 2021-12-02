/* eslint-disable indent */
import { TypeAddEvent, TypeRemoveEvent } from '.'

import { isBrowser, noop, isArray, WSEVENTER } from '.'
import { listen } from '.'

export const add: TypeAddEvent = !isBrowser
  ? noop
  : (listen(),
    (
      element: Element,
      type: string | string[],
      event: Event | Event[]
    ): void => {
      const events = element[WSEVENTER] || (element[WSEVENTER] = {})
      console.log(12)
    })

export const remove: TypeRemoveEvent = !isBrowser
  ? noop
  : (
      element: Element,
      type?: string | string[],
      event?: Event | Event[]
    ): void => {
      if (WSEVENTER in element) {
        const events = element[WSEVENTER]
        console.log(12)
      }
    }
