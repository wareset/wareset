interface ISubscriber {
    p: ISubscriber;
    n: ISubscriber;
    f: (...a: any) => void;
}
interface IService<T> {
    i: number;
    v: object;
    s: ISubscriber;
    o: ISubscriber;
    w: Computed[];
    c: null | Computed;
    p: ((newValue: T, oldValue: T) => T) | null;
    f: ((iam: Store<T>) => void | ((iam: Store<T>) => void)) | null;
    l: ((iam: Store<T>) => void) | null | void;
    r: (key: any) => any;
}
declare class Computed {
    readonly s: Store<any>;
    readonly f: Function;
    readonly i: Store<any>[];
    readonly x: {
        v: object;
        m: object | null;
        u: Function;
    }[];
    g: any;
    l: number;
    a: boolean;
    u: boolean;
    m: object | null;
    readonly cb: (this: Store<any>) => void;
    constructor(store: Store<any>, fn: Function);
    ps(): void;
    tt(): void;
    sb(item: Store<any>): () => void;
    it(item: Store<any>): void;
    un(): void;
}
declare class Store<T = undefined> {
    readonly _: IService<T>;
    readonly _value: T;
    constructor(value: T, props?: {
        pass?: any;
        start?: (iam: Store<T>) => void | ((iam: Store<T>) => void);
        preset?: (newValue: T, oldValue: T) => T;
        compute?: (value: T) => T;
    });
    get $(): T;
    set $(v: T);
    get(): T;
    set(v: T, pass?: any): this;
    subscribe(callback: (this: this, value: T) => void): () => void;
    toString(...a: any): T extends {
        toString(...a: any): infer I;
    } ? I : string;
    valueOf(...a: any): T extends {
        valueOf(...a: any): infer I;
    } ? I : T;
    toJSON(...a: any): T extends {
        toJSON(...a: any): infer I;
    } ? I : T;
}
export declare class IStore<T> {
    readonly _value: T;
    constructor(value: T, props?: {
        start?: (iam: IStore<T>) => void | ((iam: IStore<T>) => void);
        preset?: (newValue: T, oldValue: T) => T;
        compute?: (value: T) => T;
    });
    get $(): T;
    set $(v: T);
    get(): T;
    set(v: T, pass?: any): this;
    subscribe(callback: (this: this, value: T) => void): () => void;
    toString(...a: any): T extends {
        toString(...a: any): infer I;
    } ? I : string;
    valueOf(...a: any): T extends {
        valueOf(...a: any): infer I;
    } ? I : T;
    toJSON(...a: any): T extends {
        toJSON(...a: any): infer I;
    } ? I : T;
}
export declare class IStoreSecurity<T, P> {
    readonly _value: T;
    constructor(value: T, props?: {
        pass: P;
        start?: (iam: IStoreSecurity<T, P>) => void | ((iam: IStoreSecurity<T, P>) => void);
        preset?: (newValue: T, oldValue: T) => T;
        compute?: (value: T) => T;
    });
    get $(): T;
    get(): T;
    set(v: T, pass: P): this;
    subscribe(callback: (this: this, value: T) => void): () => void;
    toString(...a: any): T extends {
        toString(...a: any): infer I;
    } ? I : string;
    valueOf(...a: any): T extends {
        valueOf(...a: any): infer I;
    } ? I : T;
    toJSON(...a: any): T extends {
        toJSON(...a: any): infer I;
    } ? I : T;
}
declare function store<T>(value: T, props?: {
    start?: (iam: IStore<T>) => void | ((iam: IStore<T>) => void);
    preset?: (newValue: T, oldValue: T) => T;
    compute?: (value: T) => T;
}): IStore<T>;
declare function store<T, P>(value: T, props: {
    pass: P;
    start?: (iam: IStoreSecurity<T, P>) => void | ((iam: IStoreSecurity<T, P>) => void);
    preset?: (newValue: T, oldValue: T) => T;
    compute?: (value: T) => T;
}): IStoreSecurity<T, P>;
declare function batch(func: () => void): void;
declare function computed<T>(compute: () => T): Store<any>;
declare function effect<T>(compute: () => T, onChange?: (value: T) => void): () => void;
export { Store, store, batch, computed, effect };
