import { timeout } from '@wareset-utilites/timeout'

import { TypeOrder } from '.'

let NORMALIZE = false
let REMOVED_ORDERS = 0
let NORMALIZE_ORDER: TypeOrder = [1 / 0] as any
let PREV_ORDER: TypeOrder = [0, null as any, null]

const normalizeOrders = (): void => {
  let next: TypeOrder | null
  while ((next = NORMALIZE_ORDER[2]))
    (next[0] = NORMALIZE_ORDER[0] + 1), (NORMALIZE_ORDER = next)
  NORMALIZE_ORDER = [1 / 0] as any
  REMOVED_ORDERS = 0
  NORMALIZE = false
}

export const createOrder = (): TypeOrder =>
  (PREV_ORDER = PREV_ORDER[2] = [PREV_ORDER[0] + 1, PREV_ORDER, null])

export const removeOrder = (id: TypeOrder): void => {
  id[1][2] = id[2]
  if (PREV_ORDER === id) PREV_ORDER = id[1]
  else if (id[2]) {
    id[2][1] = id[1]
    if (NORMALIZE_ORDER[0] > id[1][0]) NORMALIZE_ORDER = id[1]
    if (REMOVED_ORDERS < 4e4) REMOVED_ORDERS++
    else if (!NORMALIZE) (NORMALIZE = true), timeout(99, normalizeOrders)
  }
  id[0] = -1
  id[1] = id[2] = null as any
}
