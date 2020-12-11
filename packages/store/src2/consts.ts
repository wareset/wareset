// watchable смотрибельный
// refer ссылаться

export const WATCH_LIST = 'watchList';
export const REFER_LIST = 'referList';
export const WATCHABLE_LIST = 'watchableList';
export const REFERENCE_LIST = 'referenceList';

const UN = 'un';
export const WATCH = 'watch';
export const UNWATCH: 'unwatch' = (UN + WATCH) as 'unwatch';

export const WATCHABLE = 'watchable';
export const UNWATCHABLE: 'unwatchable' = (UN + WATCHABLE) as 'unwatchable';

export const REFER = 'refer';
export const UNREFER: 'unrefer' = (UN + REFER) as 'unrefer';

export const REFERENCE = 'reference';
export const UNREFERENCE: 'unreference' = (UN + REFERENCE) as 'unreference';

export const BRIDGE = 'bridge';
export const UNBRIDGE: 'unbridge' = (UN + BRIDGE) as 'unbridge';
