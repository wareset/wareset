declare const __encodeURIComponent__: typeof encodeURIComponent, __decodeURIComponent__: typeof decodeURIComponent;
declare const __btoa__: (s: string) => string;
declare const __atob__: (s: string) => string;
declare const stringify: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (string | number)[], space?: string | number): string;
};
declare const jsonparse: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
declare const hashFactory: (complexity?: number, numsalt?: number) => (s: string) => string;
export { hashFactory, __btoa__ as btoa, __atob__ as atob, __encodeURIComponent__ as encodeURIComponent, __decodeURIComponent__ as decodeURIComponent, stringify, jsonparse };
