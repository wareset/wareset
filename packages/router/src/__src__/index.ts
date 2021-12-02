/* eslint-disable no-invalid-this */
/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable no-throw-literal */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */

import { decodeURIComponent } from '@wareset-utilites/lang/decodeURIComponent'
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify'
// import { isFunction } from '@wareset-utilites/is/isFunction'
import { Boolean } from '@wareset-utilites/lang/Boolean'
import { Object } from '@wareset-utilites/lang/Object'
// import { concat } from '@wareset-utilites/array/concat'
import { RegExp } from '@wareset-utilites/lang/RegExp'
import { isNaN } from '@wareset-utilites/is/isNaN'
import { esc } from '@wareset-utilites/escape'

const create = Object.create

import {
  Server,
  IncomingMessage as IncomingMessageOrigin,
  ServerResponse as ServerResponseOrigin,
  IncomingHttpHeaders
} from 'http'

export interface TypeIncomingMessage extends IncomingMessageOrigin {
  [key: string]: any
  baseUrl: string
  originalUrl: string
  params: { [key: string]: string }
  query: { [key: string]: string }
  body?: { [key: string]: any }
  _parsedUrl: {
    protocol: string
    host: string | null
    hostname: string | null
    port: string | null
    path: string
    pathname: string
    search: string | null
    query: string | null
    _raw: string
    _route: string
    _routes: string[]
  }
}

export interface TypeServerResponse extends ServerResponseOrigin {
  [key: string]: any
}

const METHODS = 'get|head|post|put|delete|connect|options|trace|patch'
const METHODS_LOWERS = METHODS.split('|')
const METHODS_UPPERS = METHODS.toUpperCase().split('|')
METHODS_LOWERS.push('all')
METHODS_UPPERS.push(METHODS)

export declare type TypeHandler = (
  req: TypeIncomingMessage,
  res: TypeServerResponse,
  next: (err?: any) => void
) => void

export declare type TypeHandlerError =
  | number
  | { [key: string]: any; code: number }
  | { [key: string]: any; status: number }
  | undefined
  | null

export declare type TypeHandlerForStatuses = (
  req: TypeIncomingMessage,
  res: TypeServerResponse,
  next: (err?: TypeHandlerError) => void,
  err?: TypeHandlerError
) => void

export declare type TypeRoute = {
  id: number[]
  route: string
  count: number
  spread: boolean
  __dirty: string
  handlers: TypeHandler[]
  regex: RegExp
}

const TRIMER_REG = /^\/+|\/+$/g
// const SLUG = '\0%SLUG'
// const SLUGS = '\0%SLUGS'

const getTypesList = (method: string | string[]): string[] =>
  [].concat(
    ...[].concat(method as any).map((v: any) =>
      v
        .trim()
        .toUpperCase()
        .split(/[^-\w]+/))
  )

export class Router {
  declare _routes: {
    [key: string]: { [key: string]: TypeRoute[] } & { '-1': { [key: string]: TypeRoute[] } }
  }
  declare listen: Server['listen']
  declare baseUrl: string

  declare all: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare get: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare head: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare post: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare put: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare delete: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare connect: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare options: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare trace: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare patch: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this

  constructor(
    readonly server: Server,
    {
      baseUrl = '',
      useBefore = [],
      useAfter = [],
      statusCodes = {},
      statusCodesFactory = __statusCodesFactory__,
      queryParser = __queryparse__
    }: {
      baseUrl?: string
      useBefore?: TypeHandler | TypeHandler[]
      useAfter?: TypeHandler | TypeHandler[]
      statusCodes?: {
        [key: string]: TypeHandlerForStatuses | TypeHandlerForStatuses[]
      }
      statusCodesFactory?: typeof __statusCodesFactory__
      queryParser?: Function
    } = {}
  ) {
    this._routes = create(null)
    useBefore = __arrayfy__(useBefore)
    useAfter = __arrayfy__(useAfter)

    const _statusCodes = create(null)
    for (const k in statusCodes) {
      if (!isNaN(+k)) _statusCodes[k] = __arrayfy__(statusCodes[k])
    }
    statusCodes = _statusCodes

    for (let k = 2, a = [404, 500]; k-- > 0;) {
      if (!(a[k] in statusCodes)) statusCodes[a[k]] = [statusCodesFactory(a[k])]
    }

    for (let k = METHODS_LOWERS.length; k-- > 0;) {
      (this as any)[METHODS_LOWERS[k]] = (this as any).add.bind(this, METHODS_UPPERS[k])
    }

    this.baseUrl = baseUrl.replace(TRIMER_REG, '')
    // if (iam.baseUrl.length > 0) iam.baseUrl += '/'

    server.on(
      'request',
      (req: TypeIncomingMessage, res: TypeServerResponse): void => {
        console.log(req)
        const method = req.method!.toUpperCase()

        req.baseUrl = this.baseUrl
        req.originalUrl = req.url!
        req._parsedUrl = new ParsedUrl(req)
        req.query =
          req._parsedUrl.query !== null ? queryParser(req._parsedUrl.query) : {}

        const count = req._parsedUrl._routes.length
        let matches: any = null
        let slug!: TypeRoute

        if (method in this._routes) {
          SEARCH_ROUTE: {
            if (count in this._routes[method]) {
              for (let i = 0, l = this._routes[method][count].length; i < l; ++i) {
                if ((matches = (slug = this._routes[method][count][i])
                  .regex.exec(req._parsedUrl._route)) !== null) {
                  break SEARCH_ROUTE
                }
              }
            }
            // if (999 in this._routes[method]) {
            //   for (let i = 0, l = this._routes[method][999].length; i < l; ++i) {
            //     if ((slug = this._routes[method][999][i]).count <= count &&
            //       (matches = slug.regex.exec(req._parsedUrl._route)) !== null) {
            //       break SEARCH_ROUTE
            //     }
            //   }
            // }
            for (let j = count; j >= 0; --j) {
              if (j in this._routes[method][-1]) {
                for (let i = 0, l = this._routes[method][-1][j].length; i < l; ++i) {
                  if ((matches = (slug = this._routes[method][-1][j][i])
                    .regex.exec(req._parsedUrl._route)) !== null) {
                    break SEARCH_ROUTE
                  }
                }
              }
            }
          }
        }

        const handlers = [useBefore, statusCodes[404] as any, useAfter]

        if (matches !== null) {
          if (matches.groups !== void 0) req.params = matches.groups
          else req.params = {}
          handlers[1] = slug.handlers
          console.log('SLUG', req.params, slug)
        } else {
          req.params = {}
        }

        let i = -1
        let j = 0
        const next = (err?: any): void => {
          if (err != null) {
            if (j === 2) handlers[2] = []
            const code = +err || +err.code || +err.status || 500;
            (handlers[j = 1] = code in statusCodes
              ? (statusCodes as any)[code] : statusCodes[code] =
                [statusCodesFactory(code)])[i = 0](req, res, next, err)
          } else if (++i in handlers[j]) {
            handlers[j][i](req, res, next)
          } else if (j < 2) {
            handlers[++j][i = 0] ? handlers[j][i](req, res, next) : next()
          } else {
            (handlers[j = 1] =
            (statusCodes as any)[500])[i = 0](req, res, next)
          }
        }
        next()
        // setImmediate(next)
      }
    )
    this.listen = server.listen.bind(server)
  }

  add(
    method: string | string[],
    route: string,
    ...handlers: TypeHandler[] | TypeHandler[][]
  ): this {
    const slug = __createRoute__(route, __arrayfy__(...handlers))
    // const count = slug.spread ? 999 : slug.count

    for (let types = getTypesList(method),
      type: string, obj: any, routes: any[], k: number,
      i = 0; i < types.length; ++i) {
      obj = (type = types[i]) in this._routes ? this._routes[type]
        : (this._routes[type] = create(null),
        this._routes[type][-1] = create(null), this._routes[type])

      if (!slug.spread) {
        routes = slug.count in obj
          ? obj[slug.count] : obj[slug.count] = []
      } else {
        routes = slug.count in obj[-1]
          ? obj[-1][slug.count] : obj[-1][slug.count] = []
      }

      k = routes.length
      for (let id2: any, res = 0; k-- > 0;) {
        if (routes[k].__dirty === slug.__dirty) {
          throw `ROUTER_ERROR: Dublicate route ${slug.route} instead of ${routes[k].route}`
        }
        id2 = routes[k].id
        for (let i = 0; i < slug.id.length; ++i) {
          if (i >= id2.length || (res = slug.id[i] - id2[i]) !== 0) break
        }
        if ((res !== 0 ? res : id2.length - slug.id.length) > 0) break
      }
      routes.splice(++k, 0, slug)
    }

    return this
  }
}

const __createRoute__ = (route: string, handlers: TypeHandler[]): TypeRoute => {
  const id: number[] = []
  let spread = false
  let pattern = '^'
  // let __dirty = ''

  route = route.replace(TRIMER_REG, '')
  // const routeArr = ('/' + route).split(/(?=\/)/)

  for (let k = 0, a = route.split(/\[(.*?(?:\(.+?\))?)\]/); k < a.length; ++k) {
    const v = a[k]
    if (v) {
      if (k % 2 === 0) {
        id.push(-v.split('/').filter(Boolean).length)
        pattern += esc(v)
        // __dirty += v
      } else {
        if (v.indexOf('/') > -1) {
          throw `ROUTER_ERROR: Unavailable character "/" in route ${route} in ${v}`
        }
        let [, key, regex] = /([^(]+)(\(.+\))?$/.exec(v)!
        const isSpread = v.indexOf('...') === 0
        let weight = regex ? 2 : 4

        if (isSpread && key) key = key.slice(3)
        regex = (regex || '([^/]+?)').slice(1)
        key = !key ? '(' : '(?<' + key + '>'
        // __dirty += regex

        if (isSpread) {
          regex = `\0%SPREAD_S${key}\0%SPREAD_K(?:${regex}\0%SPREAD_E`
          spread = true
          weight++
        } else {
          regex = key + regex
        }

        pattern += regex
        id.push(weight)
      }
    }
  }

  pattern += '\\/?$'
  if (spread) {
    pattern = pattern.replace(
      /([^/]*?)\0%SPREAD_S(.*?)\0%SPREAD_K(.*?)\0%SPREAD_E/g,
      (_0, pre, key, regex) =>
        '(?:' + pre + key + regex + '(?:\\/' + regex + ')*))'
    )
  }

  const res = {
    id,
    route,
    count  : route.split('/').length,
    spread,
    __dirty: pattern.replace(/\?<.+?>/g, ''),
    handlers,
    regex  : new RegExp(pattern)
  }
  return res
}

const __arrayfy__ = (...val: any): TypeHandler[] =>
  [].concat(...val).filter((v) => typeof v === 'function')

const __statusCodesFactory__ =
(_code: number): TypeHandlerForStatuses => (_req, _res, _next, _err): void => {
  _res.statusCode = _code
  _res.end(_err ? jsonStringify(_err, void 0, 2) : '' + _code)
}

const __queryparse__ = (s: string): any => {
  const res: any = {}
  const decode = s.indexOf('%') > -1
  s.split('&').forEach((v: any) => {
    res[(v = decode
      ? v.split('=').map(decodeURIComponent)
      : v.split('='))[0]] = v[1] || ''
  })
  return res
}
// try {
//   queryparse = require('querystring').parse
// } catch (e) {}

const getHeaderValue = (
  value: string | string[] | undefined
): string | null => {
  if (value !== void 0 && value.length > 0) {
    if (typeof value !== 'string') value = value[0] || ''
    const i = value.lastIndexOf(',')
    return i > -1 ? value.slice(i + 1).trim() : value.trim()
  }
  return null
}

class ParsedUrl {
  _: {
    headers: IncomingHttpHeaders
    encrypted: boolean
    protocol?: string
    host?: string | null
    hostname?: string | null
    port?: string | null
  }

  path: string
  pathname: string
  search: string | null
  query: string | null
  _raw: string
  _route: string
  _routes: string[]

  constructor(req: TypeIncomingMessage) {
    let i: number
    this._ = {
      headers  : req.headers,
      encrypted: !!(
        (req as any).socket.encrypted || (req as any).connection.encrypted
      ),
      protocol: void 0,
      host    : void 0,
      hostname: void 0,
      port    : void 0
    }
    this._raw = req.url!

    this.path = this._raw
    this.pathname = this._raw
    if ((i = this._raw.indexOf('?')) > -1) {
      this.pathname = this._raw.slice(0, i)
      this.query = this._raw.slice(i + 1)
      this.search = '?' + this.query
    } else {
      this.search = this.query = null
    }

    this._route = this.pathname.replace(TRIMER_REG, '')
    if (this._route.indexOf('%') > -1) {
      this._route = decodeURIComponent(this._route)
    }
    this._routes = this._route.split('/')
  }

  get protocol(): string {
    return this._.protocol !== void 0
      ? this._.protocol
      : this._.protocol =
          getHeaderValue(this._.headers['x-forwarded-proto']) ||
          'http' + (this._.encrypted ? 's' : '')
  }

  get host(): string | null {
    return this._.host !== void 0
      ? this._.host
      : this._.host =
          getHeaderValue(this._.headers['x-forwarded-host']) ||
          getHeaderValue(this._.headers.host) ||
          getHeaderValue(this._.headers[':authority']) ||
          null
  }

  get hostname(): string | null {
    let i: number
    return this._.hostname !== void 0
      ? this._.hostname
      : this._.hostname = !this.host
        ? null
        : (i = this._.host!.indexOf(':')) > -1
          ? this._.host!.slice(0, i)
          : this._.host!
  }

  get port(): string | null {
    let i: number
    return this._.port !== void 0
      ? this._.port
      : this._.port = this.host && (i = this._.host!.indexOf(':')) > -1
        ? this._.host!.slice(i + 1)
        : null
  }
}
