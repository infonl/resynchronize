import {
  getPayload,
  isLoading,
  isDone,
  getError
} from './utils'

/**
 * Gets the async state properties for connection
 * @param {object} asyncProp Async state property
 */
const getAsyncProperties = (asyncProp) => ({
  payload: getPayload(asyncProp),
  loading: isLoading(asyncProp),
  done: isDone(asyncProp),
  error: getError(asyncProp)
})

export {
  getAsyncProperties as default
}
