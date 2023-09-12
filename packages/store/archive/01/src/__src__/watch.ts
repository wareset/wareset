import { EH_SRV, EH_SUB, EN_LISTYPE } from '.'
import { TypeStore } from '.'
import { watchStoreSetVals, noop } from '.'
import { runListenUpdate } from '.'

const __noopArr__: any[] = []
export const addWatcherLink = (
  storeWatch: TypeStore,
  storeLink: TypeStore
): void => {
  const storeWatchService = storeWatch._
  const storeLinkService = storeLink._;
  (
    storeWatchService[EH_SRV.links] || (storeWatchService[EH_SRV.links] = [])
  ).push({
    _              : storeLinkService,
    [EH_SUB.update]: (): void => {
      watchStoreSetVals(storeLinkService[EH_SRV.watch]!, __noopArr__)
      storeLink.set(
        storeLinkService.inherit
          ? storeWatchService[EH_SRV.value]
          : storeLinkService[EH_SRV.valueOrigin]
      )
    },
    [EH_SUB.destroy]: noop,
    [EH_SUB.needRun]: false,
    [EH_SUB.force]  : false
  })
  runListenUpdate(storeWatchService, EN_LISTYPE.onSubscribe)
}

export const removeWatcherLink = (
  storeWatch: TypeStore,
  storeLink: TypeStore
): void => {
  const links = storeWatch._[EH_SRV.links]!
  if (links) {
    for (let i = links.length; i-- > 0;) {
      if (links[i]._ === storeLink._) {
        links.splice(i, 1)
        runListenUpdate(storeWatch._, EN_LISTYPE.onSubscribe)
        break
      }
    }
  }
}
