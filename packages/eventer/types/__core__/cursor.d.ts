import { TypeUnlistener } from '.';
export declare type TypeCursorEvent = {
    type: string;
    target: Element;
    direction: string;
    isFirst: boolean;
    isFinal: boolean;
    page: {
        x: number;
        y: number;
    };
    delta: {
        x: number;
        y: number;
    };
    offset: {
        x: number;
        y: number;
    };
    client: {
        x: number;
        y: number;
    };
    screen: {
        x: number;
        y: number;
    };
    isTrusted: boolean;
    event: PointerEvent;
};
export declare type TypeCursorEventListener = (e: TypeCursorEvent) => void;
export declare type TypeCursor = (target: Element, event: string | string[], listeners?: TypeCursorEventListener | TypeCursorEventListener[]) => TypeUnlistener;
export declare const cursor: TypeCursor;
