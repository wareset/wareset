import type { ServerResponse } from 'http'
import { stringify } from '.'

export function ResJson(
  this:ServerResponse,
  s: any
): ReturnType<ServerResponse['end']> {
  this.writeHead(200, { 'Content-Type': 'application/json' })
  return this.end(stringify(s))
}
