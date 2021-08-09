/* eslint-disable security/detect-non-literal-fs-filename */

import { findIndexRight } from '@wareset-utilites/array/findIndexRight'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { spliceWith } from '@wareset-utilites/array/spliceWith'
import { values } from '@wareset-utilites/object/values'
import { last } from '@wareset-utilites/array/last'

import { TypeService } from './service'

import { HK, HLK } from './ekeys'

import { launchListeners } from './queue'

declare type TypeWatchObj = { [key: number]: TypeService<any> }
export declare type TypeWatch = TypeService<any>[]
export declare type TypeWatchObservables = TypeWatch

const REFER_LIST: [TypeService<any>, TypeWatchObj][] = []

export const launchAutoWatch = <T>(service: TypeService<T>): void => {
  if (!service[HK.destroyed] && REFER_LIST[0] && REFER_LIST[0][0] !== service)
    last(REFER_LIST)![1][service[HK.id][0]] = service
}

export const createAutoWatch = <T>(service: TypeService<T>): void => {
  REFER_LIST.push([service, {}])
}

export const addWatcher = <T, B>(
  service: TypeService<T>,
  serviceWatcher: TypeService<B>
): void => {
  serviceWatcher[HK.links].push(service)
  launchListeners(serviceWatcher, HLK.subscribe, [service[HK.store]])
}

export const removeWatcher = <T, B>(
  service: TypeService<T>,
  serviceWatcher: TypeService<B>
): void => {
  spliceWith(serviceWatcher[HK.links], service, 1)
  launchListeners(serviceWatcher, HLK.subscribe, [service[HK.store]])
}

export const updateAutoWatch = <T>(service: TypeService<T>): void => {
  const i = findIndexRight(REFER_LIST, (v) => v[0] === service)

  const oldWatch = service[HK.watch]
  const newWatchObj = REFER_LIST.splice(i, 1)[0][1]
  const newWatch = []
  // let nuWatch!: boolean
  forEachLeft(oldWatch, (serviceWatcher) => {
    const id = serviceWatcher[HK.id][0]

    if (id in newWatchObj) delete newWatchObj[id], newWatch.push(serviceWatcher)
    else removeWatcher(service, serviceWatcher)
  })
  newWatch.push(
    ...values(newWatchObj).map(
      (serviceWatcher) => (addWatcher(service, serviceWatcher), serviceWatcher)
    )
  )
  service[HK.watch] = newWatch
}
