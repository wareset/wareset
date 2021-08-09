import { TypeService, TypeSubscriber } from './service';
declare type TypeQueueInclude = {
    [key: string]: TypeSubscriber;
};
export declare type TypeQueue = [TypeQueueInclude];
export declare const launchQueue: () => void;
export declare const addSubscriberInQueue: (subscriber: TypeSubscriber) => void;
export declare const refreshSubscribersAndWatchers: <T>(service: TypeService<T>, needUpdate: boolean | null) => void;
export declare const launchListeners: <T>(service: TypeService<T>, type: number, data?: any[]) => void;
export {};
