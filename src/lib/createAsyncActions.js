import { createAction } from './utils'

function getAsyncKeys (storeKey) {
  return {
    start: `START_${storeKey}`,
    flush: `FLUSH_${storeKey}`,
    done: `DONE_${storeKey}`,
    error: `ERROR_${storeKey}`,
    reset: `RESET_${storeKey}`
  }
}

/**
 * Basic async actions structure
 * @param {string} storeKey unique identifier for the store
 */
function AsyncActions (storeKey) {
  const { start, flush, done, error, reset } = getAsyncKeys(storeKey)
  this.start = createAction(start)
  this.flush = createAction(flush)
  this.done = createAction(done)
  this.error = createAction(error)
  this.reset = createAction(reset)
  this.toString = () => storeKey
}

/**
 * Create a set of basic async actions using a unique identifier
 * @param {string} storeKey unique identifier for the store
 */
const createAsyncActions = storeKey => new AsyncActions(storeKey)

export {
  getAsyncKeys,
  createAsyncActions as default,
  AsyncActions
}
