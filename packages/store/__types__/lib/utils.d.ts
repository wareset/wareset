export declare const getSortedKeys: {
    (object: ArrayLike<any>): string[];
    <K extends string>(object: Record<K, any>): K[];
};
export declare const awaiter: <T>(value: T | Promise<T>, cb: (value: T) => void) => void;
