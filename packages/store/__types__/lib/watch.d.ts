import { TypeService } from './service';
export declare type TypeWatch = TypeService<any>[];
export declare type TypeWatchObservables = TypeWatch;
export declare const launchAutoWatch: <T>(service: TypeService<T>) => void;
export declare const createAutoWatch: <T>(service: TypeService<T>) => void;
export declare const addWatcher: <T, B>(service: TypeService<T>, serviceWatcher: TypeService<B>) => void;
export declare const removeWatcher: <T, B>(service: TypeService<T>, serviceWatcher: TypeService<B>) => void;
export declare const updateAutoWatch: <T>(service: TypeService<T>) => void;
