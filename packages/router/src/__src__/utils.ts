import { TypeHandler, TypeHandlerForErrors } from '.'

export const trimSlashes = (s: string): string =>
  s.replace(/^[/\\]+|[/\\]+$/g, '')

export const create = Object.create

export const getHandlers = (...val: any): TypeHandler[] =>
  [].concat(...val).filter((v) => typeof v === 'function')

export const getMethods = (method: string | string[]): string[] =>
  [].concat(
    ...[].concat(method as any).map((v: any) =>
      v
        .trim()
        .toUpperCase()
        .split(/[^-\w]+/))
  )

export const queryParser = (s: string): { [key: string]: string | string[] | undefined } => {
  const res: any = {}
  const decode = s.indexOf('%') > -1
  for (let a = s.split('&'), k: string, v: string, i = 0; i < a.length; i++) {
    [k, v] = decode ? a[i].split('=').map(decodeURIComponent) : a[i].split('=')
    if (k) {
      v = v || ''
      if (k in res) Array.isArray(res[k]) ? res[k].push(v) : res[k] = [res[k], v]
      else res[k] = v
    }
  }

  return res
}

export const statusCodesFactory =
(_code: number): TypeHandlerForErrors => (_req, _res, _next, _err): void => {
  _res.statusCode = _code
  _res.end(_err ? JSON.stringify(_err, null, 2) : '' + _code)
}
