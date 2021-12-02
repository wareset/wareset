import { EH_SRV, EH_SUB, EH_CONTEXT } from '.'
import { TypeWatch, TypeSubscriber, TypeQueue, TypeContext } from '.'

import { isNotEqualValue } from '.'

// const QUEUE_CONTAINERS: [TypeQueue, TypeQueue] = [{}, {}]
// let QUEUE_ID = 0
// let QUEUE_IS_BLOCKED = false
// let QUEUE_HAS_BEEN_CHANGED = false
// let QUEUE = QUEUE_CONTAINERS[QUEUE_ID]

const __updating__ = (watch: TypeWatch): boolean =>
  !!watch[0]._[EH_SRV.updating]

const __notequal__ = (watch: TypeWatch): boolean =>
  isNotEqualValue(watch[0], watch[1])

export const launchQueue = (ctx: TypeContext): void => {
  if (!ctx[EH_CONTEXT.QUEUE_IS_BLOCKED]) {
    ctx[EH_CONTEXT.QUEUE_IS_BLOCKED] = true

    const QUEUE_NEXT: TypeQueue = {}

    for (
      let sub: TypeSubscriber, id: number, QUEUE = ctx[EH_CONTEXT.QUEUE];
      ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED];

    ) {
      ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED] = false

      // eslint-disable-next-line guard-for-in
      for (const id0 in QUEUE) {
        sub = QUEUE[id0]
        delete QUEUE[id0]
        id = sub._[EH_SRV.id].v

        if (sub[EH_SUB.needRun] && id > 0) {
          if (
            sub._.lazy &&
            sub._[EH_SRV.watch] &&
            sub._[EH_SRV.watch]!.some(__updating__)
          ) {
            QUEUE_NEXT[id] = sub
          } else if (+id0 === id) {
            sub[EH_SUB.needRun] = false
            if (
              sub[EH_SUB.force] && !(sub[EH_SUB.force] = false) ||
              !sub._[EH_SRV.watch] ||
              sub._[EH_SRV.watch]!.some(__notequal__)
            ) {
              sub[EH_SUB.update]()
              if (ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED]) break
            }
          } else {
            QUEUE[id] = sub
            ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED] = true
            break
          }
        }
      }
    }

    ctx[EH_CONTEXT.QUEUE] = QUEUE_NEXT
    ctx[EH_CONTEXT.QUEUE_IS_BLOCKED] = false
  }
}

export const addSubscriberInQueue = (
  ctx: TypeContext,
  sub: TypeSubscriber,
  force: boolean | undefined
): void => {
  sub[EH_SUB.needRun] = true
  force && (sub[EH_SUB.force] = true)
  ctx[EH_CONTEXT.QUEUE][sub._[EH_SRV.id].v] = sub
  ctx[EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED] = true
}
