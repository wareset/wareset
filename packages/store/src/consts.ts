export const OBSERVED = 'observed';
export const DEPENDED = 'depended';
export const OBSERVABLES = 'observables';
export const DEPENDENCIES = 'dependencies';

const UN = 'un';
export const OBSERVE = 'observe';
export const UNOBSERVE: 'unobserve' = (UN + OBSERVE) as 'unobserve';

export const OBSERVABLE = 'observable';
export const UNOBSERVABLE: 'unobservable' = (UN + OBSERVABLE) as 'unobservable';

export const DEPEND = 'depend';
export const UNDEPEND: 'undepend' = (UN + DEPEND) as 'undepend';

export const DEPENDENCY = 'dependency';
export const UNDEPENDENCY: 'undependency' = (UN + DEPENDENCY) as 'undependency';

export const BRIDGE = 'bridge';
export const UNBRIDGE: 'unbridge' = (UN + BRIDGE) as 'unbridge';
