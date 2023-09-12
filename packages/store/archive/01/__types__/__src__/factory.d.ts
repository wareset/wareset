import { TypeStore, TypeContext } from '.';
export declare const contextFactory: () => TypeContext;
export declare const storeFactory: (context?: TypeContext) => {
    <V, R = V, W1 = V, W2 = V, W3 = V, W4 = V, W5 = V, W6 = V, VP = V, RP = R, RET = TypeStore<R extends Promise<any> ? V extends Promise<any> ? RP : V | RP : R>>(value: V | Promise<VP> | TypeStore<V>, watch: [TypeStore<W1>, TypeStore<W2>, TypeStore<W3>, TypeStore<W4>, TypeStore<W5>, TypeStore<W6>], proxy: (newValue: W1 | W2 | W3 | W4 | W5 | W6 | (V extends Promise<any> ? VP : V), store: RET) => R | Promise<RP | TypeStore<RP>> | TypeStore<R>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): RET;
    <V_1, R_1 = V_1, W1_1 = V_1, W2_1 = V_1, W3_1 = V_1, W4_1 = V_1, W5_1 = V_1, VP_1 = V_1, RP_1 = R_1, RET_1 = TypeStore<R_1 extends Promise<any> ? V_1 extends Promise<any> ? RP_1 : V_1 | RP_1 : R_1>>(value: V_1 | Promise<VP_1> | TypeStore<V_1>, watch: [TypeStore<W1_1>, TypeStore<W2_1>, TypeStore<W3_1>, TypeStore<W4_1>, TypeStore<W5_1>], proxy: (newValue: W1_1 | W2_1 | W3_1 | W4_1 | W5_1 | (V_1 extends Promise<any> ? VP_1 : V_1), store: RET_1) => R_1 | Promise<RP_1 | TypeStore<RP_1>> | TypeStore<R_1>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): RET_1;
    <V_2, R_2 = V_2, W1_2 = V_2, W2_2 = V_2, W3_2 = V_2, W4_2 = V_2, VP_2 = V_2, RP_2 = R_2, RET_2 = TypeStore<R_2 extends Promise<any> ? V_2 extends Promise<any> ? RP_2 : V_2 | RP_2 : R_2>>(value: V_2 | Promise<VP_2> | TypeStore<V_2>, watch: [TypeStore<W1_2>, TypeStore<W2_2>, TypeStore<W3_2>, TypeStore<W4_2>], proxy: (newValue: W1_2 | W2_2 | W3_2 | W4_2 | (V_2 extends Promise<any> ? VP_2 : V_2), store: RET_2) => R_2 | Promise<RP_2 | TypeStore<RP_2>> | TypeStore<R_2>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): RET_2;
    <V_3, R_3 = V_3, W1_3 = V_3, W2_3 = V_3, W3_3 = V_3, VP_3 = V_3, RP_3 = R_3, RET_3 = TypeStore<R_3 extends Promise<any> ? V_3 extends Promise<any> ? RP_3 : V_3 | RP_3 : R_3>>(value: V_3 | Promise<VP_3> | TypeStore<V_3>, watch: [TypeStore<W1_3>, TypeStore<W2_3>, TypeStore<W3_3>], proxy: (newValue: W1_3 | W2_3 | W3_3 | (V_3 extends Promise<any> ? VP_3 : V_3), store: RET_3) => R_3 | Promise<RP_3 | TypeStore<RP_3>> | TypeStore<R_3>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): RET_3;
    <V_4, R_4 = V_4, W1_4 = V_4, W2_4 = V_4, VP_4 = V_4, RP_4 = R_4, RET_4 = TypeStore<R_4 extends Promise<any> ? V_4 extends Promise<any> ? RP_4 : V_4 | RP_4 : R_4>>(value: V_4 | Promise<VP_4> | TypeStore<V_4>, watch: [TypeStore<W1_4>, TypeStore<W2_4>], proxy: (newValue: W1_4 | W2_4 | (V_4 extends Promise<any> ? VP_4 : V_4), store: RET_4) => R_4 | Promise<RP_4 | TypeStore<RP_4>> | TypeStore<R_4>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): RET_4;
    <V_5, R_5 = V_5, W = V_5, VP_5 = V_5, RP_5 = R_5, RET_5 = TypeStore<R_5 extends Promise<any> ? V_5 extends Promise<any> ? RP_5 : V_5 | RP_5 : R_5>>(value: V_5 | Promise<VP_5> | TypeStore<V_5>, watch: TypeStore<W>[], proxy: (newValue: W | (V_5 extends Promise<any> ? VP_5 : V_5), store: RET_5) => R_5 | Promise<RP_5 | TypeStore<RP_5>> | TypeStore<R_5>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): RET_5;
    <V_6, R_6 = V_6, W_1 = V_6, VP_6 = V_6, RP_6 = R_6, RET_6 = TypeStore<R_6 extends Promise<any> ? V_6 extends Promise<any> ? RP_6 : V_6 | RP_6 : R_6>>(value: V_6 | Promise<VP_6> | TypeStore<V_6>, watch: TypeStore<W_1>, proxy: (newValue: W_1 | (V_6 extends Promise<any> ? VP_6 : V_6), store: RET_6) => R_6 | Promise<RP_6 | TypeStore<RP_6>> | TypeStore<R_6>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): RET_6;
    <V_7, W1_5 = V_7, W2_5 = V_7, W3_4 = V_7, W4_3 = V_7, W5_2 = V_7, W6_1 = V_7, VP_7 = V_7>(value: V_7 | Promise<VP_7> | TypeStore<V_7>, watch: [TypeStore<W1_5>, TypeStore<W2_5>, TypeStore<W3_4>, TypeStore<W4_3>, TypeStore<W5_2>, TypeStore<W6_1>], props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): TypeStore<W1_5 | W2_5 | W3_4 | W4_3 | W5_2 | W6_1 | (V_7 extends Promise<any> ? VP_7 : V_7)>;
    <V_8, W1_6 = V_8, W2_6 = V_8, W3_5 = V_8, W4_4 = V_8, W5_3 = V_8, VP_8 = V_8>(value: V_8 | Promise<VP_8> | TypeStore<V_8>, watch: [TypeStore<W1_6>, TypeStore<W2_6>, TypeStore<W3_5>, TypeStore<W4_4>, TypeStore<W5_3>], props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): TypeStore<W1_6 | W2_6 | W3_5 | W4_4 | W5_3 | (V_8 extends Promise<any> ? VP_8 : V_8)>;
    <V_9, W1_7 = V_9, W2_7 = V_9, W3_6 = V_9, W4_5 = V_9, VP_9 = V_9>(value: V_9 | Promise<VP_9> | TypeStore<V_9>, watch: [TypeStore<W1_7>, TypeStore<W2_7>, TypeStore<W3_6>, TypeStore<W4_5>], props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): TypeStore<W1_7 | W2_7 | W3_6 | W4_5 | (V_9 extends Promise<any> ? VP_9 : V_9)>;
    <V_10, W1_8 = V_10, W2_8 = V_10, W3_7 = V_10, VP_10 = V_10>(value: V_10 | Promise<VP_10> | TypeStore<V_10>, watch: [TypeStore<W1_8>, TypeStore<W2_8>, TypeStore<W3_7>], props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): TypeStore<W1_8 | W2_8 | W3_7 | (V_10 extends Promise<any> ? VP_10 : V_10)>;
    <V_11, W1_9 = V_11, W2_9 = V_11, VP_11 = V_11>(value: V_11 | Promise<VP_11> | TypeStore<V_11>, watch: [TypeStore<W1_9>, TypeStore<W2_9>], props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): TypeStore<W1_9 | W2_9 | (V_11 extends Promise<any> ? VP_11 : V_11)>;
    <V_12, W_2 = V_12, VP_12 = V_12>(value: V_12 | Promise<VP_12> | TypeStore<V_12>, watch: TypeStore<W_2>[], props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): TypeStore<W_2 | (V_12 extends Promise<any> ? VP_12 : V_12)>;
    <V_13, W_3 = V_13, VP_13 = V_13>(value: V_13 | Promise<VP_13> | TypeStore<V_13>, watch: TypeStore<W_3>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): TypeStore<W_3 | (V_13 extends Promise<any> ? VP_13 : V_13)>;
    <V_14, R_7 = V_14, VP_14 = V_14, RP_7 = R_7, RET_7 = TypeStore<R_7 extends Promise<any> ? V_14 extends Promise<any> ? RP_7 : V_14 | RP_7 : R_7>>(value: V_14 | Promise<VP_14> | TypeStore<V_14>, proxy: (newValue: V_14 extends Promise<any> ? VP_14 : V_14, store: RET_7) => R_7 | Promise<RP_7 | TypeStore<RP_7>> | TypeStore<R_7>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): RET_7;
    <V_15, R_8 = V_15, VP_15 = V_15, RP_8 = R_8, RET_8 = TypeStore<R_8 extends Promise<any> ? V_15 extends Promise<any> ? RP_8 : V_15 | RP_8 : R_8>>(value: V_15 | Promise<VP_15> | TypeStore<V_15>, watch: TypeStore<any>[], proxy: (newValue: any, store: RET_8) => R_8 | Promise<RP_8 | TypeStore<RP_8>> | TypeStore<R_8>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): RET_8;
    <V_16, VP_16 = V_16>(value: V_16 | Promise<VP_16> | TypeStore<V_16>, watch: TypeStore<any>[], props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): TypeStore<any>;
    <V_17, VP_17 = V_17>(value?: V_17 | Promise<VP_17> | TypeStore<V_17>, props?: {
        lazy?: boolean;
        strict?: boolean;
        inherit?: boolean;
    }): TypeStore<V_17 extends Promise<any> ? VP_17 : V_17>;
};
