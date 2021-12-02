/// <reference types="node" />
import { Router } from './__src__';
export default Router;
export { TypeHandler, TypeHandlerForStatuses, TypeHandlerError, TypeIncomingMessage, TypeServerResponse } from './__src__';
export declare const createRouter: (a_0: import("http").Server, a_1?: {
    baseUrl?: string;
    useBefore?: import("./__src__").TypeHandler | import("./__src__").TypeHandler[];
    useAfter?: import("./__src__").TypeHandler | import("./__src__").TypeHandler[];
    statusCodes?: {
        [key: string]: import("./__src__").TypeHandlerForStatuses | import("./__src__").TypeHandlerForStatuses[];
    };
    statusCodesFactory?: (_code: number) => import("./__src__").TypeHandlerForStatuses;
    queryParser?: Function;
}) => Router;
