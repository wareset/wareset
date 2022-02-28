import { getEventSettings } from '.'

export type TypeUnlistener = () => void
export type TypeElement = HTMLElement | SVGElement | Document
export type TypeEventSettings = ReturnType<typeof getEventSettings>
