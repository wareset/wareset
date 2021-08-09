import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { keys } from '@wareset-utilites/object/keys'

import { TypeQueue } from './queue'
import { HSK } from './ekeys'

export declare type TypeOrder = [number]

let ORDER_LIST: TypeOrder[] = []
const REMOVED_ORDERS_LENGTH_ARR = [0]

export const createOrder = (_tmp?: never): TypeOrder => (
  ORDER_LIST.push((_tmp = [ORDER_LIST.length + 1] as never)), _tmp!
)

export const removeOrder = (n: TypeOrder): void => {
  REMOVED_ORDERS_LENGTH_ARR[0]++, (ORDER_LIST[n[0] - 1][0] = 0)
}

export const normalizeOrderList = (QUEUE: TypeQueue): void => {
  // console.log('o', [REMOVED_ORDERS_LENGTH_ARR[0]])
  if (REMOVED_ORDERS_LENGTH_ARR[0] > 3e3) {
    let i = (REMOVED_ORDERS_LENGTH_ARR[0] = 0)
    ORDER_LIST = ORDER_LIST.filter((v) => !!(v[0] && (v[0] = ++i)))

    const queue0 = QUEUE[0]
    QUEUE[0] = {}
    forEachLeft(keys(queue0), (id) => {
      QUEUE[0][queue0[id][HSK.id][0]] = queue0[id]
    })

    // console.log('OOO', [ORDER_LIST.length])
  }
}
