import { TypeStore } from '.';
export declare const REFER_LIST: {
    readonly l: [TypeStore, {
        [key: number]: TypeStore;
    }][];
    b: boolean;
};
export declare const proxyWatch: (_newValue: any, _iam: TypeStore) => void;
export declare const proxyAutoWatch: (_newValue: any, _iam: TypeStore) => void;
export declare const proxyDefault: (newValueProxy: any, store: TypeStore) => void;
export declare const update: (newValue: any, store: TypeStore) => void;
