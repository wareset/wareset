export const enum HK {
  id,
  watch,

  lazy,

  subscribers,
  destroyed,
  updating,

  valueOrigin,
  value,

  listeners,
  links,

  store,

  update,
  set,
  get,

  isProxy,
  isNeedUpdate
}

export const VK: { [key: string]: string } = {
  [HK.destroyed]: 'destroyed',
  [HK.updating]: 'updating',

  [HK.update]: 'update',
  [HK.set]: 'set',
  [HK.get]: 'get',

  [HK.lazy]: 'lazy'
  // [HK.readonly]: 'readonly',
}

export const enum HSK {
  id,
  watch,

  lazy,

  subscribe,
  destroy,
  update
}

export const enum HLK {
  all,
  subscribe,
  destroy,
  update,
  change
}

export const VLK: { [key: string]: number } = {
  subscribe: HLK.subscribe,
  destroy: HLK.destroy,
  update: HLK.update,
  change: HLK.change
}
