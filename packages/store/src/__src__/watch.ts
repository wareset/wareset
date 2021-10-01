import { EH_SRV, EH_SUB } from '.'
import { TypeStore } from '.'

export const addWatcherLink = (
  storeWatcher: TypeStore<any>,
  storeLink: TypeStore<any>
): void => {
  storeWatcher._[EH_SRV.links].push({
    _: storeLink._,
    [EH_SUB.update]: (): void => {
      storeLink.set(
        storeLink._.inherit
          ? storeWatcher._[EH_SRV.value]
          : storeLink._[EH_SRV.valueOrigin]
      )
    },
    [EH_SUB.needRun]: false
  })
  for (const sub of storeWatcher._[EH_SRV.onSubscribe]) sub[EH_SUB.update]()
}

export const removeWatcherLink = (
  storeWatcher: TypeStore<any>,
  storeLink: TypeStore<any>
): void => {
  for (let i = storeWatcher._[EH_SRV.links].length; i-- > 0; ) {
    if (storeWatcher._[EH_SRV.links][i]._ === storeLink._) {
      storeWatcher._[EH_SRV.links].splice(i, 1)
      for (const sub of storeWatcher._[EH_SRV.onSubscribe]) sub[EH_SUB.update]()
      break
    }
  }
}
