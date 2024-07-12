import { TypeUnlistener, TypeElement } from '.';
export declare type TypeNativeEvent = Event;
export declare type TypeNativeEventListener = (e: TypeNativeEvent) => void;
export declare type TypeNative = (target: TypeElement, event: string | string[], listeners?: TypeNativeEventListener | TypeNativeEventListener[]) => TypeUnlistener;
export declare const native: TypeNative;
