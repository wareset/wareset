import type {
  Server as TypeHttpServer,
  IncomingMessage,
  ServerResponse
} from 'http'

import type { ParsedUrl } from '.'

import type { Server as TypeHttpsServer } from 'https'

export { TypeHttpServer, TypeHttpsServer }

export interface TypeIncomingMessage extends IncomingMessage {
  [key: string]: any
  baseUrl: string
  originalUrl: string
  params: { [key: string]: string }
  query: { [key: string]: string | string[] | undefined }
  body?: { [key: string]: any }
  _parsedUrlWS: ParsedUrl
  // _parsedUrl: {
  //   protocol: string
  //   host: string | null
  //   hostname: string | null
  //   port: string | null
  //   path: string
  //   pathname: string
  //   search: string | null
  //   query: string | null
  //   _raw: string
  //   _route: string
  //   _routes: string[]
  // }
}

export interface TypeServerResponse extends ServerResponse {
  locals: { [key: string]: any }
  [key: string]: any
}

export declare type TypeHandler = (
  req: TypeIncomingMessage,
  res: TypeServerResponse,
  next: (err?: any) => void
) => void

export declare type TypeError =
  | number
  | { [key: string]: any; code: number }
  | { [key: string]: any; status: number }
  | undefined
  | null

export declare type TypeHandlerForErrors = (
    req: TypeIncomingMessage,
    res: TypeServerResponse,
    next: (err?: TypeError) => void,
    err: TypeError,
  ) => void

export declare type TypeRoute = {
    id: number[]
    route: string
    count: number
    spread: boolean
    _dirty: string
    handlers: TypeHandler[]
    regex: RegExp
  }
