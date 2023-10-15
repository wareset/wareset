interface ISubscriber {
    v: any;
    p: ISubscriber;
    n: ISubscriber;
    f: (...a: any) => void;
}
interface IService<T = any, P = any> {
    i: number;
    s: ISubscriber;
    n: ISubscriber;
    w: IComputedService[];
    c: null | IComputedService;
    p: ((newValue: T, oldValue: T) => T) | null;
    f: ((iam: IWSignal<T, P>) => void | ((iam: IWSignal<T, P>) => void)) | null;
    l: ((iam: IWSignal<T, P>) => void) | null | void;
    r: ((key: any) => P) | null;
}
interface IComputedService {
    readonly s: IWSignal;
    readonly c: Function;
    o: any[] | null;
    readonly i: IWSignal[];
    readonly x: {
        v: any;
        m: object | null;
        u: Function;
    }[];
    g: any;
    l: number;
    t: boolean;
    u: boolean;
    m: object | null;
    f: (this: IWSignal) => void;
}
declare class IWSignal<T = any, P = any> {
    readonly _: IService<T, P>;
    readonly _value: T;
    get $(): T;
    get(): T;
    set(v: T, protect?: P): this;
    subscribe(callback: (value: T) => void): () => void;
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
declare function noop(): void;
export declare class ISignal<T> {
    readonly _: IService;
    private readonly _value;
    get $(): T;
    set $(v: T);
    get(): T;
    set(v: T): this;
    subscribe(callback: (value: T) => void): () => void;
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
export declare class ISignalProtected<T, P> {
    readonly _: IService;
    private readonly _value;
    get $(): T;
    get(): T;
    set(v: T, protect: P): this;
    subscribe(callback: (value: T) => void): () => void;
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
export type IObserve = readonly unknown[] | [] | null;
type ISubscribed<T> = T extends null | undefined ? T : T extends object & {
    _: IService;
    subscribe(callback: infer F): any;
} ? F extends (value: infer V, ...args: any) => any ? V : never : T;
export type IObserveValues<O extends IObserve> = O extends null | undefined ? O : {
    -readonly [P in keyof O]: ISubscribed<O[P]>;
};
declare function signal<T, P = any, O extends IObserve = null>(value: T, props: {
    protect: P;
    prepare?: (iam: ISignalProtected<T, P>) => void | ((iam: ISignalProtected<T, P>) => void);
    control?: (newValue: T, oldValue: T) => T;
    compute?: (value: T, observe: IObserveValues<O>) => T;
    observe?: O;
}): ISignalProtected<T, P>;
declare function signal<T, O extends IObserve = null>(value: T, props?: {
    prepare?: (iam: ISignal<T>) => void | ((iam: ISignal<T>) => void);
    control?: (newValue: T, oldValue: T) => T;
    compute?: (value: T, observe: IObserveValues<O>) => T;
    observe?: O;
}): ISignal<T>;
declare function computed<T, O extends IObserve = null, V = T | undefined>(observe: O, compute: (_: V, observe: IObserveValues<O>) => T): ISignal<T>;
declare function effect<T, O extends IObserve = null, V = T | undefined>(observe: O, compute: (_: V, observe: IObserveValues<O>) => T, onChange?: (value: T) => void): typeof noop;
declare function batch(func: () => void): void;
declare function isSignal<T = any>(thing: any): thing is ISignal<T> | ISignalProtected<T, any>;
declare function isSignalProtected<T = any>(thing: any): thing is ISignalProtected<T, any>;
export { signal, isSignal, isSignalProtected, computed, effect, batch };
