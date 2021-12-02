import { Router } from './__src__'
export default Router

export {
  TypeHandler,
  TypeHandlerForStatuses,
  TypeHandlerError,
  TypeIncomingMessage,
  TypeServerResponse
} from './__src__'

export const createRouter = (
  ...a: ConstructorParameters<typeof Router>
): Router => new Router(...a)
