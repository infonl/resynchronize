import { createAction } from './utils'

/**
 * Basic async actions structure
 * @param {string} storeKey unique identifier for the store
 */
function AsyncActions (storeKey) {
  this.start = createAction(`START_${storeKey}`)
  this.done = createAction(`DONE_${storeKey}`)
  this.error = createAction(`ERROR_${storeKey}`)
  this.reset = createAction(`RESET_${storeKey}`)
  this.toString = () => storeKey
}

/**
 * Create a set of basic async actions using a unique identifier
 * @param {string} storeKey unique identifier for the store
 */
const createAsyncActions = storeKey => new AsyncActions(storeKey)

export {
  createAsyncActions as default,
  AsyncActions
}
