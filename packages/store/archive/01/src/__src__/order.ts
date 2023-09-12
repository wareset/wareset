import { TypeOrder } from '.'

let NORMALIZE = false
let REMOVED_ORDERS = 0
let PREV_ORDER: TypeOrder = { v: 0, n: null }
const NORMALIZE_ORDER_DDEFAULT: TypeOrder = { v: 1 / 0 }
let NORMALIZE_ORDER: TypeOrder = NORMALIZE_ORDER_DDEFAULT

const normalizeOrders = (): void => {
  let next: TypeOrder | undefined
  while (next = NORMALIZE_ORDER.n!) next.v = NORMALIZE_ORDER.v + 1, NORMALIZE_ORDER = next
  NORMALIZE_ORDER = NORMALIZE_ORDER_DDEFAULT
  REMOVED_ORDERS = 0
  NORMALIZE = false
}

export const createOrder = (): TypeOrder =>
  PREV_ORDER = PREV_ORDER.n = { v: PREV_ORDER.v + 1, p: PREV_ORDER, n: null }

export const removeOrder = (id: TypeOrder): void => {
  id.p!.n = id.n
  if (PREV_ORDER === id) PREV_ORDER = id.p!
  else if (id.n) {
    id.n.p = id.p
    if (NORMALIZE_ORDER.v > id.p!.v) NORMALIZE_ORDER = id.p!
    if (REMOVED_ORDERS < 4e4) REMOVED_ORDERS++
    else if (!NORMALIZE) NORMALIZE = true, setTimeout(normalizeOrders, 99)
  }
  id.v = -1
  id.p = id.n = null
}
