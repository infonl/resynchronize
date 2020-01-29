import {
  getPayload,
  isLoading,
  isDone,
  hasError,
  getError,
  isCancelled
} from './utils'

/**
 * Gets the async state status properties for connection
 * @param {object} asyncProp Async state property
 */
const getAsyncStatus = (asyncProp) => ({
  loading: isLoading(asyncProp),
  done: isDone(asyncProp),
  cancel: isCancelled(asyncProp),
  error: hasError(asyncProp)
})

/**
 * Gets the async state properties for connection
 * @param {object} asyncProp Async state property
 */
const getAsyncProperties = (asyncProp) => ({
  status: getAsyncStatus(asyncProp),
  payload: getPayload(asyncProp),
  error: getError(asyncProp)
})

export {
  getAsyncProperties as default,
  getAsyncStatus
}
