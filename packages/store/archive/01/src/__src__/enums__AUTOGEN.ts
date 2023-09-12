export const enum EH_SRV {
  id = "a",

  subscribers = "b",

  listeners = "c",
  onSubscribe = "d",
  onDestroy = "e",
  onChange = "f",

  links = "g",
  watch = "h",

  destroyed = "i",
  updating = "j",

  value = "k",
  valueOrigin = "l",

  nextcb = "m",
  proxy = "n",
  proxyOrigin = "o",

  destroyer = "p",
  context = "q",
  force = "r"
}

export const enum EH_SUB {
  destroy = "a",
  update = "b",
  needRun = "c",
  force = "d",
  type = "e"
}

export const enum EH_CONTEXT {
  QUEUE = "a",
  QUEUE_IS_BLOCKED = "b",
  QUEUE_HAS_BEEN_CHANGED = "c"
}
