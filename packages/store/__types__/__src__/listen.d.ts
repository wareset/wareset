import { EN_LISTYPE } from '.';
import { TypeStore, TypeService, TypeUnsubscriber } from '.';
export declare const runListenUpdate: (service: TypeService, type: EN_LISTYPE.onSubscribe | EN_LISTYPE.onDestroy | EN_LISTYPE.onChange) => void;
export declare const storeOnSubscribe: (store: TypeStore, cb: (count: number, unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<() => void>) => TypeUnsubscriber;
export declare const storeOnDestroy: (store: TypeStore, cb: (startDestroy: boolean, unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<() => void>) => TypeUnsubscriber;
export declare const storeOnChange: <T>(store: TypeStore<T>, cb: (oldValue_and_newValue: [T, T], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<() => void>) => TypeUnsubscriber;
