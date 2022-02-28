import { TypeUnlistener } from '.';
export declare type TypeResizeEvent<T = Element> = {
    target: T;
    width: number;
    height: number;
    top: number;
    left: number;
};
export declare type TypeResizeEventListener<T = Element> = (e: TypeResizeEvent<T>) => void;
export declare type TypeResize = <T = Element>(target: T, listeners: TypeResizeEventListener<T> | TypeResizeEventListener<T>[], autostart?: boolean) => TypeUnlistener;
export declare const resize: TypeResize;
