import { defineProperty } from '@wareset-utilites/object/defineProperty'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { isNill } from '@wareset-utilites/is/isNill'

export { TypeStore } from './Store'
import { Store, isStore } from './Store'
import { innerStoreService, blankStoreService } from './service'
export {
  storeSubscribe,
  storeListener,
  storeDestroy,
  Unsubscriber
} from './service'

import { HK, VK } from './ekeys'

const StorePrototype = Store.prototype

defineProperty(StorePrototype, '__', { value: innerStoreService })

forEachLeft([HK.update, HK.set, HK.get], (v) => {
  defineProperty(StorePrototype, VK[v], { value: blankStoreService(v, true) })
})

forEachLeft([HK.destroyed, HK.updating, HK.lazy /* , 'readonly' */], (v) => {
  defineProperty(StorePrototype, VK[v], { get: blankStoreService(v) })
})

forEachLeft(['toString', 'valueOf', 'toJSON'], (v, k) => {
  defineProperty(StorePrototype, v, {
    value: function (...a: any) {
      let val = this.get()
      val = isNill(val) || !val[v] ? val : val[v](...a)
      return k ? val : val + ''
    }
  })
})

export { Store, isStore }
