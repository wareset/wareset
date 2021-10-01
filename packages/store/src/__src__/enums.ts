export const enum EH_SRV {
  id,

  subscribers,

  onSubscribe,
  onDestroy,
  onChange,

  links,
  watch,

  destroyed,
  updating,

  value,
  valueOrigin,

  nextcb,
  proxy,
  proxyOrigin,

  context
}

export const enum EH_SUB {
  destroy,
  update,
  needRun
}

export const enum EH_CONTEXT {
  QUEUE,
  QUEUE_IS_BLOCKED,
  QUEUE_HAS_BEEN_CHANGED
}
