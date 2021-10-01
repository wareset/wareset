import { TypeStore, TypeUnsubscriber } from '.';
declare type MS<V> = V extends TypeStore<infer S> ? S : V;
export declare const storeSubscribe: {
    <A, B = A, C = B, D = C, E = D, F = E, G = F, H = G>(stores: [A, B, C, D, E, F, G, H], subscriber: (values: [MS<A>, MS<B>, MS<C>, MS<D>, MS<E>, MS<F>, MS<G>, MS<H>], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
    <A_1, B_1 = A_1, C_1 = B_1, D_1 = C_1, E_1 = D_1, F_1 = E_1, G_1 = F_1>(stores: [A_1, B_1, C_1, D_1, E_1, F_1, G_1], subscriber: (values: [MS<A_1>, MS<B_1>, MS<C_1>, MS<D_1>, MS<E_1>, MS<F_1>, MS<G_1>], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
    <A_2, B_2 = A_2, C_2 = B_2, D_2 = C_2, E_2 = D_2, F_2 = E_2>(stores: [A_2, B_2, C_2, D_2, E_2, F_2], subscriber: (values: [MS<A_2>, MS<B_2>, MS<C_2>, MS<D_2>, MS<E_2>, MS<F_2>], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
    <A_3, B_3 = A_3, C_3 = B_3, D_3 = C_3, E_3 = D_3>(stores: [A_3, B_3, C_3, D_3, E_3], subscriber: (values: [MS<A_3>, MS<B_3>, MS<C_3>, MS<D_3>, MS<E_3>], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
    <A_4, B_4 = A_4, C_4 = B_4, D_4 = C_4>(stores: [A_4, B_4, C_4, D_4], subscriber: (values: [MS<A_4>, MS<B_4>, MS<C_4>, MS<D_4>], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
    <A_5, B_5 = A_5, C_5 = B_5>(stores: [A_5, B_5, C_5], subscriber: (values: [MS<A_5>, MS<B_5>, MS<C_5>], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
    <A_6, B_6 = A_6>(stores: [A_6, B_6], subscriber: (values: [MS<A_6>, MS<B_6>], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
    <A_7>(stores: [A_7], subscriber: (values: [MS<A_7>], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
    <V>(store: V | TypeStore<V>, subscriber: (values: [MS<V>], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
    <S = any>(stores: S, subscriber: (values: MS<S extends (infer A_8)[] ? A_8 : S>[], unsubscriber: TypeUnsubscriber) => void | (() => void) | Promise<void | (() => void)>, props?: {
        lazy?: boolean;
    }): TypeUnsubscriber;
};
export {};
