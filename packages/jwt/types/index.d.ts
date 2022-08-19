import { btoa, atob, hashFactory } from './lib';
export { btoa, atob, hashFactory };
export declare const utf82b64: (str: string) => string;
export declare const b642utf8: (str: string) => string;
export declare const createJWT: (signatureFn: (s: string) => string, password: string, payload?: {
    [key: string]: any;
}, header?: {
    [key: string]: string;
}) => string;
