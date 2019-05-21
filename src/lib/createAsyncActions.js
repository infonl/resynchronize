import { createAction } from './utils'

/**
 * Basic async actions structure
 * @param {string} storeKey unique identifier for the store
 */
function AsyncActions (storeKey) {
  this.START = createAction(`START_${storeKey}`)
  this.DONE = createAction(`DONE_${storeKey}`)
  this.ERROR = createAction(`ERROR_${storeKey}`)
  this.RESET = createAction(`RESET_${storeKey}`)
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
