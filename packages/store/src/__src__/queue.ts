import { EH_SRV, EH_SUB, EH_CONTEXT } from '.'
import { TypeSubscriber, TypeQueue, TypeContext } from '.'

import { storeIsUpdating } from '.'

// const QUEUE_CONTAINERS: [TypeQueue, TypeQueue] = [{}, {}]
// let QUEUE_ID = 0
// let QUEUE_IS_BLOCKED = false
// let QUEUE_HAS_BEEN_CHANGED = false
// let QUEUE = QUEUE_CONTAINERS[QUEUE_ID]

export const launchQueue = (ctx: TypeContext): void => {
  if (!ctx[EH_CONTEXT.QUEUE_IS_BLOCKED]) {
    ctx[EH_CONTEXT.QUEUE_IS_BLOCKED] = true

    let sub: TypeSubscriber, id: number

    const QUEUE = ctx[EH_CONTEXT.QUEUE]
    const QUEUE_NEXT: TypeQueue = {}

    while (ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED]) {
      ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED] = false

      // eslint-disable-next-line guard-for-in
      for (const id0 in QUEUE) {
        sub = QUEUE[id0]
        delete QUEUE[id0]
        id = sub._[EH_SRV.id][0]

        if (sub[EH_SUB.needRun] && id > 0)
          if (sub._.lazy && sub._[EH_SRV.watch].some(storeIsUpdating)) {
            QUEUE_NEXT[id] = sub
          } else if (+id0 === id) {
            sub[EH_SUB.needRun] = false
            sub[EH_SUB.update]()
            if (ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED]) break
          } else {
            QUEUE[id] = sub
            ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED] = true
            break
          }
      }
    }

    ctx[EH_CONTEXT.QUEUE] = QUEUE_NEXT
    ctx[EH_CONTEXT.QUEUE_IS_BLOCKED] = false
  }
}

export const addSubscriberInQueue = (
  ctx: TypeContext,
  sub: TypeSubscriber
): void => {
  sub[EH_SUB.needRun] = true
  ctx[EH_CONTEXT.QUEUE][sub._[EH_SRV.id][0]] = sub
  ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED] = true
}
