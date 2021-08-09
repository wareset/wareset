import { TypeQueue } from './queue';
export declare type TypeOrder = [number];
export declare const createOrder: (_tmp?: never) => TypeOrder;
export declare const removeOrder: (n: TypeOrder) => void;
export declare const normalizeOrderList: (QUEUE: TypeQueue) => void;
