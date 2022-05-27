import {
  queryParser as queryParserDefault,
  statusCodesFactory as statusCodesFactoryDefalut
} from './utils'
import { create, getHandlers, getMethods, trimSlashes } from './utils'
export * from './utils'

import {
  TypeRoute,
  TypeHttpServer, TypeHttpsServer,
  TypeHandler, TypeHandlerForErrors,
  TypeIncomingMessage, TypeServerResponse
} from './types'
export * from './types'

import { createRoute } from './createRoute'
import { ParsedUrl } from './ParsedUrl'
export { ParsedUrl }

const METHODS = 'get|head|post|put|delete|connect|options|trace|patch'
const METHODS_LOWERS = METHODS.split('|')
const METHODS_UPPERS = METHODS.toUpperCase().split('|')
// METHODS_LOWERS.push('all')
// METHODS_UPPERS.push(METHODS)

export { METHODS_LOWERS as METHODS }

export class Router {
  declare _routes: {
    [key: string]: { [key: string]: TypeRoute[] } & { '-1': { [key: string]: TypeRoute[] } }
  }
  declare listen: TypeHttpServer['listen']
  declare baseUrl: string

  // declare all: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
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
    readonly server: TypeHttpServer | TypeHttpsServer,
    {
      baseUrl = '',
      useBefore = [],
      useAfter = [],
      statusCodes = {},
      statusCodesFactory = statusCodesFactoryDefalut,
      queryParser = queryParserDefault
    }: {
      baseUrl?: string
      useBefore?: TypeHandler | TypeHandler[]
      useAfter?: TypeHandler | TypeHandler[]
      statusCodes?: {
        [key: string]: TypeHandlerForErrors | TypeHandlerForErrors[]
      }
      statusCodesFactory?: typeof statusCodesFactoryDefalut
      queryParser?: typeof queryParserDefault
    } = {}
  ) {
    this._routes = create(null)
    useBefore = getHandlers(useBefore)
    useAfter = getHandlers(useAfter)

    const _statusCodes = create(null)
    for (const k in statusCodes) {
      if (/* not NaN */ +k === +k) _statusCodes[k] = getHandlers(statusCodes[k])
    }
    statusCodes = _statusCodes

    for (let k = 2, a = [404, 500]; k-- > 0;) {
      if (!(a[k] in statusCodes)) statusCodes[a[k]] = [statusCodesFactory(a[k])]
    }

    for (let k = METHODS_LOWERS.length; k-- > 0;) {
      (this as any)[METHODS_LOWERS[k]] = (this as any).add.bind(this, METHODS_UPPERS[k])
    }

    this.baseUrl = trimSlashes(baseUrl)

    server.on(
      'request',
      (req: TypeIncomingMessage, res: TypeServerResponse): void => {
        // console.log(req)
        const method = req.method!.toUpperCase()

        req.baseUrl = this.baseUrl
        req.originalUrl = req.url!
        req._parsedUrl = req._parsedUrlWS = new ParsedUrl(req)
        req.query =
          req._parsedUrl.query != null ? queryParser(req._parsedUrl.query) : {}

        if (!res.locals) res.locals = {}

        const count = req._parsedUrl._routes.length
        let matches: any = null
        let slug!: TypeRoute

        if (method in this._routes) {
          SEARCH_ROUTE: {
            if (count in this._routes[method]) {
              for (let i = 0, l = this._routes[method][count].length; i < l; i++) {
                if ((matches = (slug = this._routes[method][count][i])
                  .regex.exec(req._parsedUrl._route)) !== null) {
                  break SEARCH_ROUTE
                }
              }
            }
            // if (999 in this._routes[method]) {
            //   for (let i = 0, l = this._routes[method][999].length; i < l; i++) {
            //     if ((slug = this._routes[method][999][i]).count <= count &&
            //       (matches = slug.regex.exec(req._parsedUrl._route)) !== null) {
            //       break SEARCH_ROUTE
            //     }
            //   }
            // }
            for (let j = count; j >= 0; --j) {
              if (j in this._routes[method][-1]) {
                for (let i = 0, l = this._routes[method][-1][j].length; i < l; i++) {
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

        if (matches != null) {
          req.params = matches.groups || {}
          handlers[1] = slug.handlers
          // console.log('SLUG', req.params, slug)
        } else {
          req.params = {}
        }

        let i = -1, j = 0
        const next = (err?: any): void => {
          if (err != null) {
            if (j === 2) handlers[2] = []
            const code = +err || +err.code || +err.status || 500
            ;(handlers[j = 1] = code in statusCodes
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
    const slug = createRoute(route, getHandlers(...handlers), this.baseUrl)
    // const count = slug.spread ? 999 : slug.count

    for (let types = getMethods(method),
      type: string, obj: any, routes: any[], k: number,
      i = 0; i < types.length; i++) {
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
        id2 = routes[k].id
        for (let i = 0; i < slug.id.length; i++) {
          if (i >= id2.length || (res = slug.id[i] - id2[i]) !== 0) break
        }
        if ((res !== 0 ? res : id2.length - slug.id.length) > 0) break
      }
      routes.splice(++k, 0, slug)
    }

    return this
  }
}
