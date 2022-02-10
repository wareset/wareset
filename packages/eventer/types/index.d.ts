declare type TypeUnlistener = () => void;
declare type TypeCallback = (e: TypeDetail) => any;
declare type TypeCallbackKey = (e: KeyboardEvent) => any;
declare type TypeAddPointerEvent = (element: Element, type: string | string[], callback: TypeCallback | TypeCallback[]) => TypeUnlistener;
declare type TypeAddKeyboardEvent = (type: string | string[], callback: TypeCallbackKey | TypeCallbackKey[]) => TypeUnlistener;
declare type TypeEvent = typeof EVENTS[keyof typeof EVENTS];
declare const EVENTS: {
    readonly s: "start";
    readonly m: "move";
    readonly e: "end";
    readonly t: "tap";
    readonly d: "dbltap";
    readonly p: "pan";
    readonly h: "hold";
    readonly r: "repeat";
    readonly fi: "focusin";
    readonly fo: "focusout";
    readonly hi: "hoverin";
    readonly ho: "hoverout";
};
declare type TypeDetail = ReturnType<typeof createDetail>;
declare const createDetail: (type: TypeEvent, isMouse: boolean, e: any) => {
    type: TypeEvent;
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
    key: {
        alt: boolean;
        ctrl: boolean;
        meta: boolean;
        shift: boolean;
    };
    touch: boolean;
    mouse: boolean;
    evt: any;
};
export declare const taps: TypeAddPointerEvent;
export declare const keys: TypeAddKeyboardEvent;
export declare const untaps: (el: Element) => void;
declare const _default: {
    taps: TypeAddPointerEvent;
    keys: TypeAddKeyboardEvent;
    untaps: (el: Element) => void;
};
export default _default;
