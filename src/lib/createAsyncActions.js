import { AVAILABLE_ACTIONS } from './consts'
import { createAction } from './utils'

function getAsyncKeys (storeKey) {
  return AVAILABLE_ACTIONS.reduce(
    (keys, key) => {
      keys[key] = `${key.toUpperCase()}_${storeKey}`
      return keys
    },
    {}
  )
}

/**
 * Basic async actions structure
 * @param {string} storeKey unique identifier for the store
 */
function AsyncActions (storeKey) {
  const asyncKeys = getAsyncKeys(storeKey)

  AVAILABLE_ACTIONS.forEach(key => { this[key] = createAction(asyncKeys[key]) })

  this.toString = () => storeKey
}

/**
 * Create a set of basic async actions using a unique identifier
 * @param {string} storeKey unique identifier for the store
 */
const createAsyncActions = storeKey => new AsyncActions(storeKey)

/**
 * Checks if the given object is an instance of async actions
 * @param {*} action Object to be checked
 * @returns {Boolean}
 */
const isAsyncActions = action =>
  AsyncActions.prototype.isPrototypeOf(action) // eslint-disable-line

export {
  AVAILABLE_ACTIONS,
  getAsyncKeys,
  isAsyncActions,
  createAsyncActions as default,
  AsyncActions
}
