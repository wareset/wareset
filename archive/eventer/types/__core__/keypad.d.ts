import { TypeUnlistener } from '.';
export declare const PRESSED_KEYS: {};
export declare type TypeKeypadEvent = KeyboardEvent;
export declare type TypeKeypadEventListener = (e: TypeKeypadEvent) => void;
export declare type TypeKeypad = (event: string | string[], listeners?: TypeKeypadEventListener | TypeKeypadEventListener[]) => TypeUnlistener;
export declare const keypad: TypeKeypad;
