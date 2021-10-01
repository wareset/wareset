import { TypeStore } from '.';
export declare const REFER_LIST: [
    TypeStore<any>,
    {
        [key: number]: TypeStore<any>;
    }
][];
export declare const proxyWatch: (_newValue: any, _iam: TypeStore<any>) => void;
export declare const proxyAutoWatch: (_newValue: any, _iam: TypeStore<any>) => void;
export declare const proxyDefault: (newValueProxy: any, store: TypeStore<any>) => void;
export declare const update: (newValue: any, store: TypeStore<any>) => void;
