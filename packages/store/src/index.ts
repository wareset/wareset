import { TypeStore, TypeContext, TypeUnsubscriber } from './__src__'
import {
  storeFactory,
  contextFactory,
  Store,
  isStore,
  storeSubscribe,
  storeOnSubscribe,
  storeOnDestroy,
  storeOnChange,
  storeDestroy
} from './__src__'

export {
  storeFactory,
  contextFactory,
  Store,
  isStore,
  storeSubscribe,
  storeOnSubscribe,
  storeOnDestroy,
  storeOnChange,
  storeDestroy
}

// declare type TypeStoreCtor<T> = new (
//   ...a: ConstructorParameters<typeof Store>
// ) => TypeStore<T>
declare type TypeStoreFactoryFunction = typeof storeFactory
declare type TypeContextFactoryFunction = typeof contextFactory
declare type TypeStoreSubscribeFunction = typeof storeSubscribe
declare type TypeStoreOnSubscribeFunction = typeof storeOnSubscribe
declare type TypeStoreOnDestroyFunction = typeof storeOnDestroy
declare type TypeStoreOnChangeFunction = typeof storeOnChange
declare type TypeStoreDestroyFunction = typeof storeDestroy

export {
  TypeStore,
  TypeContext,
  TypeUnsubscriber,
  TypeStoreFactoryFunction,
  TypeContextFactoryFunction,
  TypeStoreSubscribeFunction,
  TypeStoreOnSubscribeFunction,
  TypeStoreOnDestroyFunction,
  TypeStoreOnChangeFunction,
  TypeStoreDestroyFunction
}
