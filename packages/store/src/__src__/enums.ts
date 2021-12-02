export const enum EH_SRV {
  id,

  subscribers,

  listeners,
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

  destroyer,
  context,
  force
}

export const enum EH_SUB {
  destroy,
  update,
  needRun,
  force,
  type
}

export const enum EH_CONTEXT {
  QUEUE,
  QUEUE_IS_BLOCKED,
  QUEUE_HAS_BEEN_CHANGED
}
