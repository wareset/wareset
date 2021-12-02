/// <reference types="node" />
import { Server, IncomingMessage as IncomingMessageOrigin, ServerResponse as ServerResponseOrigin } from 'http';
export interface TypeIncomingMessage extends IncomingMessageOrigin {
    [key: string]: any;
    baseUrl: string;
    originalUrl: string;
    params: {
        [key: string]: string;
    };
    query: {
        [key: string]: string;
    };
    body?: {
        [key: string]: any;
    };
    _parsedUrl: {
        protocol: string;
        host: string | null;
        hostname: string | null;
        port: string | null;
        path: string;
        pathname: string;
        search: string | null;
        query: string | null;
        _raw: string;
        _route: string;
        _routes: string[];
    };
}
export interface TypeServerResponse extends ServerResponseOrigin {
    [key: string]: any;
}
export declare type TypeHandler = (req: TypeIncomingMessage, res: TypeServerResponse, next: (err?: any) => void) => void;
export declare type TypeHandlerError = number | {
    [key: string]: any;
    code: number;
} | {
    [key: string]: any;
    status: number;
} | undefined | null;
export declare type TypeHandlerForStatuses = (req: TypeIncomingMessage, res: TypeServerResponse, next: (err?: TypeHandlerError) => void, err?: TypeHandlerError) => void;
export declare type TypeRoute = {
    id: number[];
    route: string;
    count: number;
    spread: boolean;
    __dirty: string;
    handlers: TypeHandler[];
    regex: RegExp;
};
export declare class Router {
    readonly server: Server;
    _routes: {
        [key: string]: {
            [key: string]: TypeRoute[];
        } & {
            '-1': {
                [key: string]: TypeRoute[];
            };
        };
    };
    listen: Server['listen'];
    baseUrl: string;
    all: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    get: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    head: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    post: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    put: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    delete: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    connect: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    options: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    trace: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    patch: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    constructor(server: Server, { baseUrl, useBefore, useAfter, statusCodes, statusCodesFactory, queryParser }?: {
        baseUrl?: string;
        useBefore?: TypeHandler | TypeHandler[];
        useAfter?: TypeHandler | TypeHandler[];
        statusCodes?: {
            [key: string]: TypeHandlerForStatuses | TypeHandlerForStatuses[];
        };
        statusCodesFactory?: typeof __statusCodesFactory__;
        queryParser?: Function;
    });
    add(method: string | string[], route: string, ...handlers: TypeHandler[] | TypeHandler[][]): this;
}
declare const __statusCodesFactory__: (_code: number) => TypeHandlerForStatuses;
export {};
