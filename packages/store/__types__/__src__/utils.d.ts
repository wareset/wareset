import { TypeStore, TypeWatch } from '.';
export declare const isPromiseCustom: (value: any) => boolean;
export declare const awaiter: <T, A>(value: T | Promise<T>, cb: (value: T, value2: A) => void, value2?: A) => void;
export declare const noop: () => void;
export declare const watchStoreRemove: (watch: TypeWatch[], v: TypeStore) => void;
export declare const isNotEqualValue: (store: TypeStore, value: any) => boolean;
export declare const watchStoreSetVals: (watch: TypeWatch[], list: any[]) => void;
