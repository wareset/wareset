import { forEachLeft } from '@wareset-utilites/array/forEachLeft'

import { TypeService, TypeSubscriber, TypeListener } from './service'
import { normalizeOrderList } from './order'
import { getSortedKeys } from './utils'

import { HK, HSK, HLK } from './ekeys'

declare type TypeQueueInclude = { [key: string]: TypeSubscriber }
export declare type TypeQueue = [TypeQueueInclude]
const QUEUE: TypeQueue = [{}]
let QUEUE_IS_BLOCKED = false

export const launchQueue = (): void => {
  if (!QUEUE_IS_BLOCKED) {
    QUEUE_IS_BLOCKED = true
    let sub: TypeSubscriber, id0: string
    const QUEUE_INCLUDE: TypeQueueInclude = {}
    while ((sub = QUEUE[0][(id0 = getSortedKeys(QUEUE[0])[0])])) {
      delete QUEUE[0][id0]
      if (sub[HSK.lazy] && sub[HSK.watch].some((v) => v[HK.updating]))
        QUEUE_INCLUDE[id0] = sub
      else {
        // console.log('q', id0)
        sub[HSK.update]()
      }
    }
    QUEUE[0] = QUEUE_INCLUDE
    normalizeOrderList(QUEUE)
    QUEUE_IS_BLOCKED = false
  }
}

export const addSubscriberInQueue = (subscriber: TypeSubscriber): void => {
  QUEUE[0][subscriber[HSK.id][0]] = subscriber
  launchQueue()
}

export const refreshSubscribersAndWatchers = <T>(
  service: TypeService<T>,
  needUpdate: boolean | null
): void => {
  !service[HK.subscribers][0] ||
    forEachLeft(service[HK.subscribers], (subscriber) => {
      QUEUE[0][subscriber[HSK.id][0]] = subscriber
    })
  !service[HK.links][0] ||
    forEachLeft(service[HK.links], (serviceWatcher) => {
      const id = serviceWatcher[HK.id]
      QUEUE[0][id[0]] = {
        [HSK.lazy]: serviceWatcher[HK.lazy],
        [HSK.id]: id,
        [HSK.watch]: serviceWatcher[HK.watch],
        [HSK.update]: (): void => {
          serviceWatcher[HK.isNeedUpdate] = needUpdate
          serviceWatcher[HK.update](
            () =>
              serviceWatcher[HK.isProxy]
                ? serviceWatcher[HK.valueOrigin]
                : service[HK.value]
            // () => service[HK.value]
          )
        }
      }
    })
  launchQueue()
}

export const launchListeners = <T>(
  service: TypeService<T>,
  type: number,
  data?: any[]
  // cb?: () => void
): void => {
  let sub: TypeListener
  let i = 0
  while (
    (sub = service[HK.listeners][type as HLK.subscribe][i++]) &&
    sub[HLK.update](data)
  );
}
