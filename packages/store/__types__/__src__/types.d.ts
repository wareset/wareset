import { EH_SRV, EH_SUB, EH_CONTEXT } from '.';
export declare interface TypeStore<T> {
    readonly '@wareset/store': true;
    readonly _: TypeService<T>;
    $: T;
    readonly value: T;
    readonly updating: boolean;
    readonly destroyed: boolean;
    get(): T;
    set(newValue: Promise<T> | TypeStore<T> | T): void;
    update(cb: (value: T, store: this) => Promise<T> | T): void;
    destroy(): void;
    toString(...a: any[]): string;
    valueOf(...a: any[]): any;
    toJSON(...a: any[]): any;
}
export declare type TypeService<T> = {
    readonly [EH_SRV.id]: TypeOrder;
    readonly [EH_SRV.subscribers]: TypeSubscriber[];
    readonly [EH_SRV.onSubscribe]: TypeListener[];
    readonly [EH_SRV.onDestroy]: TypeListener[];
    readonly [EH_SRV.onChange]: TypeListener[];
    readonly [EH_SRV.links]: TypeSubscriber[];
    readonly [EH_SRV.watch]: TypeStore<any>[];
    [EH_SRV.destroyed]: boolean;
    [EH_SRV.updating]: boolean;
    [EH_SRV.value]: T;
    [EH_SRV.valueOrigin]: T;
    [EH_SRV.nextcb]: ((value: any, store: TypeStore<any> | any) => any) | null;
    readonly [EH_SRV.proxy]: (newValue: T, store: TypeStore<T>) => void;
    readonly [EH_SRV.proxyOrigin]: Function | null | undefined;
    readonly [EH_SRV.context]: TypeContext;
    lazy: boolean;
    strict: boolean;
    inherit: boolean;
};
export declare type TypeUnsubscriber = () => void;
export declare type TypeSubscriber = {
    readonly _: {
        readonly lazy: boolean;
        readonly [EH_SRV.id]: TypeOrder;
        readonly [EH_SRV.watch]: TypeStore<any>[];
    };
    readonly [EH_SUB.update]: (...a: any[]) => void;
    readonly [EH_SUB.destroy]?: () => void;
    [EH_SUB.needRun]: boolean;
};
export declare type TypeListener = {
    readonly [EH_SUB.update]: (someValue?: any) => void;
    readonly [EH_SUB.destroy]: () => void;
};
export declare type TypeOrder = [number, TypeOrder, TypeOrder | null];
export declare type TypeQueue = {
    [key: string]: TypeSubscriber;
};
export declare type TypeContext = {
    [EH_CONTEXT.QUEUE]: TypeQueue;
    [EH_CONTEXT.QUEUE_IS_BLOCKED]: boolean;
    [EH_CONTEXT.QUEUE_HAS_BEEN_CHANGED]: boolean;
};
