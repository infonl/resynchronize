import { AsyncActions, getAsyncKeys } from './createAsyncActions'
import { createReducer, getStateShape, INITIAL, STARTED, DONE, ERROR } from './utils'

/** default reducer for async handling */
const defaultReducer = (state = null, { payload = null }) => payload || state

const nullifierReducer = () => null

/**
 * Async node reducer builder
 * @param {String*} status Desired status on the final node
 * @param {*} payloadReducer Payload reducer
 * @param {*} errorReducer Error reducer
 * @returns {function} Reducer
 */
const getAsyncNodeReducer = (
  status = null,
  payloadReducer = defaultReducer,
  errorReducer = defaultReducer
) => (
  state,
  action
) => ({
  status,
  payload: payloadReducer(state.payload, action),
  error: errorReducer(state.errornpm, action)
})

/**
 * Handlers for async actions
 * The reducer is used on the afected property to avoid structure changes on how the library behaves
 * Status is managed by the library and cannot be altered, but the payloads can be updated using custom
 * reducers
 */
const handleStart = (payloadReducer, errorReducer = nullifierReducer) =>
  getAsyncNodeReducer(STARTED, payloadReducer, errorReducer)

const handleFlush = (payloadReducer, errorReducer = nullifierReducer) =>
  getAsyncNodeReducer(STARTED, payloadReducer, errorReducer)

const handleDone = (payloadReducer, errorReducer = nullifierReducer) =>
  getAsyncNodeReducer(DONE, payloadReducer, errorReducer)

const handleError = (payloadReducer = nullifierReducer, errorReducer) =>
  getAsyncNodeReducer(ERROR, payloadReducer, errorReducer)

const handleReset = (payloadReducer = nullifierReducer, errorReducer = nullifierReducer) =>
  getAsyncNodeReducer(INITIAL, payloadReducer, errorReducer)

/**
 * Basic action handler creator for async actions
 * @param {object} actions Async actions
 * @param {object} payloadReducers Object with a key for every reducer on every state
 * @param {object} errorReducers Object with a key for every reducer on every state
 */
const createActionsHandler = (actions = {}, payloadReducers = {}, errorReducers = {}) => ({
  [actions.start]: handleStart(payloadReducers.start, errorReducers.start),
  [actions.flush]: handleFlush(payloadReducers.flush, errorReducers.flush),
  [actions.done]: handleDone(payloadReducers.done, errorReducers.done),
  [actions.error]: handleError(payloadReducers.error, errorReducers.error),
  [actions.reset]: handleReset(payloadReducers.reset, errorReducers.reset)
})

/**
 * Create a reducer config to handle async actions
 * @param {Object} asyncActions Set of actions that include every state of a fetch process
 * @param {Object} payloadHandlers Set of action reducers
 * @param {Object} errorHandlers Set of action reducers
 * @returns {object} config to be used on a reducer
 */
const _createAsyncReducerConfig = (asyncActions, payloadHandlers, errorHandlers) => {
  let config = {}

  // If isnt an AsyncActions all the keys of the object are put into the main reducer
  if (AsyncActions.prototype.isPrototypeOf(asyncActions)) { // eslint-disable-line
    config = createActionsHandler(asyncActions, payloadHandlers, errorHandlers)
  } else {
    // @TODO CONTROL THAT THEY ARE NORMAL OBJECTS
    Object.keys(asyncActions).forEach(actionKey => {
      config = {
        ...config,
        ...createActionsHandler(asyncActions[actionKey], payloadHandlers, errorHandlers)
      }
    })
  }

  return config
}

/**
 * Create a reducer config to handle async actions
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 * @param {*} asyncHandlers Set of action reducers
 * @returns {object} config to be used on a reducer
 */
const createAsyncReducerConfig = (payloadHandlers, errorHandlers) => {
  let config = {}

  const allAsyncKeys = Object.keys(payloadHandlers).concat(Object.keys(errorHandlers)).reduce(
    (current, next) => {
      if (current.includes(next)) {
        return current
      } else {
        current.push(next)
        return current
      }
    },
    []
  )

  Object.keys(allAsyncKeys).forEach(asyncKey => {
    config = {
      ...config,
      ...createActionsHandler(
        getAsyncKeys(asyncKey),
        payloadHandlers[asyncKey],
        errorHandlers[asyncKey]
      )
    }
  })

  return config
}

/**
 * Create a reducer function to handle async actions
 * @param {*} intiialPayload Initial value of the payload, preferrably serializable
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 * @param {*} asyncHandlers Set of action reducers
 * @returns {function} async reducer
 */
const _createAsyncReducer = (intiialPayload = getStateShape(), asyncActions, payloadHandlers, errorHandlers) =>
  createReducer(
    getStateShape(INITIAL, intiialPayload, null),
    _createAsyncReducerConfig(asyncActions, payloadHandlers, errorHandlers)
  )

/**
 * Create a reducer function to handle async actions
 * @param {*} intiialPayload Initial value of the payload, preferrably serializable
 * @param {Function} payloadReducer Function used to reduce the payload on the different states
 * @param {Function} errorReducerConfig Function used to reduce the error on the different states
 */
const createAsyncReducer = (intiialPayload = getStateShape(), payloadHandlers, errorHandlers) => {
  createReducer(
    getStateShape(INITIAL, intiialPayload, null),
    createAsyncReducerConfig(payloadHandlers, errorHandlers)
  )
}

/*
// Example of the new implementation?

const getList = createAyncActions('GET_LIST')
const addItemToList = createAyncActions('ADD_ITEM_LIST')
const clearListError = createAction('CLEAR_LIST_ERROR')

getList.done([])

const newListReducer = createAsyncReducer(
  [], // INITIAL value
  { // MAIN PAYLOAD CONFIG
    // reducer for the async actions, can be filtered by status
    [getList]: {
      start: (currentPayload, action) => [] // Start
      done: (currentPayload, action) => action.payload.map(item => item.id) // Done
      error: (currentPayload, action) => [] // Error
    },
    [addItemToList]: {
      done: (currentPayload, action) => [...currentPayload, action.payload] // Done
    }
  },
  { // ERROR PAYLOAD CONFIG
    [getList]: {
      error: (previousError, action) => return action.payload.message
    }
  }
)

discarded alternatives

const newListReducer = createAsyncReducer(
  [], // INITIAL value
  { // MAIN PAYLOAD CONFIG
    // reducer for the async actions, can be filtered by status
    [getList]: (currentPayload, action) => {
      switch (action.type) {
        case getList.start: { // Hook on start
          return []
        }
        case getList.done: { // hook on done
          return action.payload.map(item => item.id)
        }
        case getList.reset: { // hook on reset
          return []
        }
        case getList.error: { // hook on error
          return []
        }
        default: {
          return currentPayload
        }
      }
    }
  },
  { // ERROR PAYLOAD CONFIG
    [getList]: (currentPayload, action) => {
      return action.payload.message
    }
  }
)

// OR

const classicListReducer = createAsyncReducer(
  [], // INITIAL value
  { // MAIN PAYLOAD CONFIG
    // reducer for the async actions, can be filtered by status
    [getList]: hookAsyncStates(
      (currentPayload, action) => currentPayload || action.payload // Default,
      {
        start: (currentPayload, action) => [] // Start
        done: (currentPayload, action) => action.payload.map(item => item.id) // Done
        error: (currentPayload, action) => [] // Error
      }
    )
    [addItemToList]: hookAsyncStates(
      (currentPayload, action) => currentPayload || action.payload // Default,
      {
        done: (currentPayload, action) => [...currentPayload, action.payload] // Done
      }
    )
  },
  { // ERROR PAYLOAD CONFIG
    [getList]: (currentPayload, action) => {
      return action.payload.message
    }
  }
)

*/

export {
  createAsyncReducer as default,
  _createAsyncReducer,
  createAsyncReducerConfig,
  _createAsyncReducerConfig,
  defaultReducer
}
