export declare const enum EH_SRV {
    id = "a",
    subscribers = "b",
    onSubscribe = "c",
    onDestroy = "d",
    onChange = "e",
    links = "f",
    watch = "g",
    destroyed = "h",
    updating = "i",
    value = "j",
    valueOrigin = "k",
    nextcb = "l",
    proxy = "m",
    proxyOrigin = "n",
    context = "o"
}
export declare const enum EH_SUB {
    destroy = "a",
    update = "b",
    needRun = "c"
}
export declare const enum EH_CONTEXT {
    QUEUE = "a",
    QUEUE_IS_BLOCKED = "b",
    QUEUE_HAS_BEEN_CHANGED = "c"
}
