import { EH_SRV, EH_SUB, EN_LISTYPE } from '.'
import { TypeStore } from '.'

import { isStore } from '.'
import { awaiter, isNotEqualValue } from '.'
import { launchQueue, addSubscriberInQueue } from '.'
import { addWatcherLink, removeWatcherLink } from '.'

export const REFER_LIST: {
  readonly l: [TypeStore, { [key: number]: TypeStore }][]
  b: boolean
} = { l: [], b: true }

export const proxyWatch = (_newValue: any, _iam: TypeStore): void => {
  REFER_LIST.b = false
  const newValueProxy = _iam._[EH_SRV.proxyOrigin]!(_newValue, _iam)
  REFER_LIST.b = true
  awaiter(newValueProxy, proxyDefault, _iam)
}

export const proxyAutoWatch = (_newValue: any, _iam: TypeStore): void => {
  const newWatchObj: { [key: number]: TypeStore } = {}
  REFER_LIST.l.push([_iam, newWatchObj])
  let newValueProxy = _iam._[EH_SRV.proxyOrigin]!(_newValue, _iam)
  if (isStore(newValueProxy)) newValueProxy = newValueProxy.get()
  REFER_LIST.l.pop()

  const watch = _iam._[EH_SRV.watch]!
  for (let id: number, i = watch.length; i-- > 0;) {
    id = watch[i][0]._[EH_SRV.id].v
    if (id in newWatchObj) delete newWatchObj[id]
    else watch.splice(i, 1), removeWatcherLink(watch[i][0], _iam)
  }

  for (const k in newWatchObj) {
    if (newWatchObj[k] !== _iam && !newWatchObj[k]._[EH_SRV.destroyed]) {
      watch.push([newWatchObj[k], newWatchObj[k]._[EH_SRV.value]])
      addWatcherLink(newWatchObj[k], _iam)
    }
  }
  awaiter(newValueProxy, proxyDefault, _iam)
}

export const proxyDefault = (newValueProxy: any, store: TypeStore): void => {
  const service = store._
  if (!service[EH_SRV.destroyed]) {
    if (service[EH_SRV.nextcb]) {
      const nextcb = service[EH_SRV.nextcb]!
      service[EH_SRV.nextcb] = null
      awaiter(nextcb(service[EH_SRV.value], store), update, store)
      return
    }

    if (isStore(newValueProxy)) newValueProxy = newValueProxy._[EH_SRV.value]

    if (service[EH_SRV.force] || isNotEqualValue(store, newValueProxy)) {
      const oldValue = service[EH_SRV.value];
      (store as any).value = service[EH_SRV.value] = newValueProxy

      if (service[EH_SRV.listeners]) {
        let liso = service[EH_SRV.listeners]![0]
        while (liso = liso.n!) {
          if (liso.v[EH_SUB.type] === EN_LISTYPE.onChange) {
            liso.v[EH_SUB.update](oldValue)

            if (service[EH_SRV.nextcb]) {
              const nextcb = service[EH_SRV.nextcb]!
              service[EH_SRV.nextcb] = null;
              (store as any).value = service[EH_SRV.value] = oldValue
              awaiter(nextcb(service[EH_SRV.value], store), update, store)
              return
            }
          }
        }
      }

      if (service[EH_SRV.subscribers]) {
        for (let i = 0; i < service[EH_SRV.subscribers]!.length; ++i) {
          addSubscriberInQueue(service[EH_SRV.context],
            service[EH_SRV.subscribers]![i],
            service[EH_SRV.force])
        }
      }

      if (service[EH_SRV.links]) {
        for (let i = 0; i < service[EH_SRV.links]!.length; ++i) {
          addSubscriberInQueue(service[EH_SRV.context],
            service[EH_SRV.links]![i],
            service[EH_SRV.force])
        }
      }
    }
  }
  service[EH_SRV.updating] = service[EH_SRV.force] = false
  launchQueue(service[EH_SRV.context])
}

export const update = (newValue: any, store: TypeStore): void => {
  const service = store._
  if (!service[EH_SRV.destroyed]) {
    if (service[EH_SRV.nextcb]) {
      const nextcb = service[EH_SRV.nextcb]!
      service[EH_SRV.nextcb] = null
      awaiter(nextcb(service[EH_SRV.value], store), update, store)
    } else {
      service[EH_SRV.proxy](
        service[EH_SRV.valueOrigin] = isStore(newValue)
          ? newValue._[EH_SRV.value]
          : newValue,
        store
      )
    }
  } else {
    service[EH_SRV.updating] = false
    launchQueue(service[EH_SRV.context])
  }
}
