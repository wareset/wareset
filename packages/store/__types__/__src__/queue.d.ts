import { TypeSubscriber, TypeContext } from '.';
export declare const launchQueue: (ctx: TypeContext) => void;
export declare const addSubscriberInQueue: (ctx: TypeContext, sub: TypeSubscriber, force: boolean | undefined) => void;
