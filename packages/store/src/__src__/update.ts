import { isFunction } from '@wareset-utilites/is/isFunction'
import { isObject } from '@wareset-utilites/is/isObject'
import { is } from '@wareset-utilites/object/is'

import { EH_SRV, EH_SUB } from '.'
import { TypeStore } from '.'

import { isStore } from '.'
import { awaiter } from '.'
import { launchQueue, addSubscriberInQueue } from '.'
import { addWatcherLink, removeWatcherLink } from '.'

export const REFER_LIST: [
  TypeStore<any>,
  { [key: number]: TypeStore<any> }
][] = []

// prettier-ignore
export const proxyWatch = (_newValue: any, _iam: TypeStore<any>): void =>
{ awaiter(_iam._[EH_SRV.proxyOrigin]!(_newValue, _iam), proxyDefault, _iam) }
// prettier-ignore
export const proxyAutoWatch = (_newValue: any, _iam: TypeStore<any>): void =>
{
  const newWatchObj: any = {}
  REFER_LIST.push([_iam, newWatchObj])
  let newValueProxy = _iam._[EH_SRV.proxyOrigin]!(_newValue, _iam)
  if (isStore(newValueProxy)) newValueProxy = newValueProxy.get()
  REFER_LIST.pop()

  const watch = _iam._[EH_SRV.watch]
  let id: number
  for (let i = watch.length; i-- > 0; ) {
    id = watch[i]._[EH_SRV.id][0]
    if (id in newWatchObj) delete newWatchObj[id]
    else removeWatcherLink(watch[i], _iam), watch.splice(i, 1)
  }

  for (const k in newWatchObj) {
    if (newWatchObj[k] !== _iam && !newWatchObj[k]._[EH_SRV.destroyed]) {
      addWatcherLink(newWatchObj[k], _iam), watch.push(newWatchObj[k])
    }
  }
  awaiter(newValueProxy, proxyDefault, _iam)
}

export const proxyDefault = (
  newValueProxy: any,
  store: TypeStore<any>
): void => {
  const service = store._
  if (!service[EH_SRV.destroyed]) {
    if (service[EH_SRV.nextcb]) {
      const nextcb = service[EH_SRV.nextcb]!
      service[EH_SRV.nextcb] = null
      awaiter(nextcb(service[EH_SRV.value], store), update, store)
    } else {
      if (isStore(newValueProxy)) newValueProxy = newValueProxy._[EH_SRV.value]

      if (
        !is(service[EH_SRV.value], newValueProxy) ||
        (!service.strict &&
          (isFunction(newValueProxy) || isObject(newValueProxy)))
      ) {
        const oldValue = service[EH_SRV.value]
        ;(store as any).value = service[EH_SRV.value] = newValueProxy
        for (const sub of service[EH_SRV.onChange]) sub[EH_SUB.update](oldValue)

        if (service[EH_SRV.nextcb]) {
          const nextcb = service[EH_SRV.nextcb]!
          service[EH_SRV.nextcb] = null
          awaiter(nextcb(service[EH_SRV.value], store), update, store)
        } else {
          service[EH_SRV.updating] = false
          for (const sub of service[EH_SRV.subscribers]) {
            addSubscriberInQueue(service[EH_SRV.context], sub)
          }
          for (const sub of service[EH_SRV.links]) {
            addSubscriberInQueue(service[EH_SRV.context], sub)
          }
          launchQueue(service[EH_SRV.context])
        }
      } else {
        service[EH_SRV.updating] = false
        launchQueue(service[EH_SRV.context])
      }
    }
  } else {
    service[EH_SRV.updating] = false
    launchQueue(service[EH_SRV.context])
  }
}

export const update = (newValue: any, store: TypeStore<any>): void => {
  const service = store._
  if (!service[EH_SRV.destroyed]) {
    if (service[EH_SRV.nextcb]) {
      const nextcb = service[EH_SRV.nextcb]!
      service[EH_SRV.nextcb] = null
      awaiter(nextcb(service[EH_SRV.value], store), update, store)
    } else {
      service[EH_SRV.proxy](
        (service[EH_SRV.valueOrigin] = isStore(newValue)
          ? newValue._[EH_SRV.value]
          : newValue),
        store
      )
    }
  } else {
    service[EH_SRV.updating] = false
    launchQueue(service[EH_SRV.context])
  }
}
