import { TypeStore, TypeUnsubscriber } from '.';
export declare const storeOnSubscribe: (store: TypeStore<any>, cb: (count: number, unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<() => void>) => TypeUnsubscriber;
export declare const storeOnDestroy: (store: TypeStore<any>, cb: (isDestroy: boolean, unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<() => void>) => TypeUnsubscriber;
export declare const storeOnChange: <T>(store: TypeStore<T>, cb: (oldValue_and_newValue: [T, T], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<() => void>) => TypeUnsubscriber;
