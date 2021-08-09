import { TypeStore, TypeProxy, TypeProps } from './Store';
import { TypeOrder } from './order';
import { TypeWatch, TypeWatchObservables } from './watch';
import { HK, HSK, HLK } from './ekeys';
export declare type Unsubscriber = () => void;
export declare type TypeService<T> = {
    [HK.subscribers]: TypeSubscriber[];
    [HK.listeners]: {
        [HLK.all]: TypeListener[];
        [HLK.subscribe]: TypeListener[];
        [HLK.destroy]: TypeListener[];
        [HLK.update]: TypeListener[];
        [HLK.change]: TypeListener[];
    };
    [HK.links]: TypeWatchObservables;
    [HK.watch]: TypeWatch;
    [HK.destroyed]: boolean;
    [HK.updating]: boolean;
    [HK.id]: TypeOrder;
    [HK.valueOrigin]: T;
    [HK.value]: T;
    [HK.store]: TypeStore<T>;
    [HK.get]: () => T;
    [HK.set]: (v: Promise<T> | TypeStore<T> | T) => any;
    [HK.update]: (cb?: (value: T, store: TypeStore<T>) => Promise<T> | T) => any;
    [HK.lazy]: boolean;
    [HK.isProxy]: boolean;
    [HK.isNeedUpdate]: boolean | null;
};
export declare type TypeSubscriber = {
    [HSK.lazy]?: boolean;
    [HSK.id]: TypeOrder;
    [HSK.watch]: TypeService<any>[];
    [HSK.update]: (...a: any[]) => void;
    [HSK.destroy]?: () => void;
    [HSK.subscribe]?: (...a: any[]) => void;
};
export declare type TypeListener = {
    [HLK.destroy]: () => void;
    [HLK.update]: (...a: any[]) => boolean;
};
export declare const storeSubscribe: (_list: any, _cb: (...a: any[]) => void | (() => void) | Promise<() => void>, _props?: TypeProps) => Unsubscriber;
export declare const storeListener: (_store: TypeStore<any>, _type: string, _cb: (...a: any[]) => void | (() => void) | Promise<() => void>, _autostart?: boolean) => Unsubscriber;
export declare const storeDestroy: (_stores: TypeStore<any> | TypeStore<any>[]) => void;
export declare const innerStoreService: <T>(_store: TypeStore<T>, _value: T, _watch?: TypeStore<T>[], _proxy?: TypeProxy, _props?: TypeProps) => void;
export declare const blankStoreService: (k: number, fn?: boolean) => any;
