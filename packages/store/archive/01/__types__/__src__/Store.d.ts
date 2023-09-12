import { TypeValueOf, TypeStore, TypeService, TypeContext, TypeUnsubscriber } from '.';
declare class Store<T> implements TypeStore<T> {
    readonly '@wareset/store': true;
    readonly _: TypeService<T>;
    readonly value: T;
    $: T;
    get updating(): boolean;
    get destroyed(): boolean;
    set force(v: boolean);
    toString: (...a: any[]) => string;
    valueOf: (...a: any[]) => TypeValueOf<T>;
    toJSON: (...a: any[]) => any;
    constructor(context: TypeContext, value?: Promise<TypeStore<T> | T> | TypeStore<T> | T, watch?: TypeStore<T | any>[] | null, proxy?: ((newValue: T | any) => Promise<TypeStore<T> | T> | TypeStore<T> | T) | null, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    });
    get(): T;
    set(newValue: Promise<TypeStore<T> | T> | TypeStore<T> | T): void;
    update(cb: (value: T, store: this) => Promise<T> | T): void;
    subscribe(callback: (value: T, unsub: TypeUnsubscriber) => void | (() => void) | Promise<() => void>): TypeUnsubscriber;
    destroy(): void;
}
export declare const storeDestroy: (store: TypeStore) => void;
declare const isStore: (thing: any) => thing is Store<any>;
export { Store, isStore };
