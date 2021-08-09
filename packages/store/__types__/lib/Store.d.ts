import { Array as __Array__ } from '@wareset-utilites/array/Array';
export declare type TypeProxy = <T>(value: T | any, self: TypeStore<T>) => Promise<T> | T;
export declare type TypeProps = {
    lazy?: any;
    readonly?: boolean;
};
declare const isStore: (thing: any) => thing is TypeStore<any>;
export declare interface TypeStore<T> {
    [key: string]: any;
    readonly __: '@store-service@';
    isStore: typeof isStore;
    0: T;
    $: T;
    value: T;
    needUpdate: boolean | null | undefined;
    readonly lazy: boolean;
    readonly readonly: boolean;
    readonly updating: boolean;
    readonly destroyed: boolean;
    get: () => T;
    set: (newValue: Promise<T> | TypeStore<T> | T) => this;
    update: (cb?: (value: T, store: this) => Promise<T> | T) => this;
}
declare class Store<T> extends __Array__ implements TypeStore<T> {
    readonly __: '@store-service@';
    static isStore: (thing: any) => thing is TypeStore<any>;
    isStore(thing: any): thing is TypeStore<any>;
    0: T;
    $: T;
    value: T;
    needUpdate: boolean;
    readonly lazy: boolean;
    readonly readonly: boolean;
    readonly updating: boolean;
    readonly destroyed: boolean;
    get: () => T;
    set: (newValue: Promise<TypeStore<T> | T> | TypeStore<T> | T) => this;
    update: (cb?: (value: T, store: this) => Promise<T> | T) => this;
    readonly toString: () => string;
    readonly valueOf: () => this[0];
    readonly toJSON: () => any;
    constructor(watch?: TypeStore<T>, props?: {
        lazy?: boolean;
        readonly?: boolean;
    });
    constructor(value?: Promise<any> | TypeStore<T> | T, props?: {
        lazy?: boolean;
        readonly?: boolean;
    });
    constructor(value: Promise<any> | TypeStore<T> | T, watch: TypeStore<T>, props?: {
        lazy?: boolean;
        readonly?: boolean;
    });
    constructor(value: Promise<any> | TypeStore<T> | T, watchList: TypeStore<T>[], props?: {
        lazy?: boolean;
        readonly?: boolean;
    });
    constructor(watch: TypeStore<T>, proxy: (newValue: T) => Promise<TypeStore<T> | T> | TypeStore<T> | T, props?: {
        lazy?: boolean;
        readonly?: boolean;
    });
    constructor(value: Promise<any> | T, proxy: (newValue: T) => Promise<TypeStore<T> | T> | TypeStore<T> | T, props?: {
        lazy?: boolean;
        readonly?: boolean;
    });
    constructor(value: Promise<any> | TypeStore<T> | T, watch: TypeStore<any>, proxy: (newValue: T | any) => Promise<TypeStore<T> | T> | TypeStore<T> | T, props?: {
        lazy?: boolean;
        readonly?: boolean;
    });
    constructor(value: Promise<any> | TypeStore<T> | T, watchList: TypeStore<any>[], proxy: (newValue: T | any) => Promise<TypeStore<T> | T> | TypeStore<T> | T, props?: {
        lazy?: boolean;
        readonly?: boolean;
    });
}
export { Store, isStore };
