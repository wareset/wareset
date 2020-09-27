export const isVoid = v => v == null;

export const getProto = v => Object.getPrototypeOf || (v => v.__proto__);
export const getCtor = v => (isVoid(v) ? v : getProto(v).constructor);

export const isArr = v => getCtor(v) === Array;
export const isObj = v => getCtor(v) === Object;
export const isNum = v => typeof v === 'number';
export const isStr = v => typeof v === 'string';
export const isBool = v => typeof v === 'boolean';
export const isFunc = v => typeof v === 'function';
export const isSymb = v => typeof v === 'symbol';

export const has = Object.prototype.hasOwnProperty.call;
