import { AsyncActions, getAsyncKeys } from './createAsyncActions'
import { createReducer, INTIAL, STARTED, DONE, ERROR } from './utils'

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
  getAsyncNodeReducer(INTIAL, payloadReducer, errorReducer)

/**
 * Basic action handler creator for async actions
 * @param {object} actions Async actions
 */
const createActionsHandler = (actions, { start, flush, done, reset, error } = {}) => ({
  [actions.start]: handleStart(start),
  [actions.flush]: handleFlush(flush),
  [actions.done]: handleDone(done),
  [actions.error]: handleError(error),
  [actions.reset]: handleReset(reset)
})

/**
 * Create a reducer config to handle async actions
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 * @param {*} asyncHandlers Set of action reducers
 * @returns {object} config to be used on a reducer
 */
const createAsyncReducerConfig = (asyncActions, asyncHandlers) => {
  let config = {}

  // If isnt an AsyncActions all the keys of the object are put into the main reducer
  if (AsyncActions.prototype.isPrototypeOf(asyncActions)) { // eslint-disable-line
    config = createActionsHandler(asyncActions, asyncHandlers)
  } else {
    // @TODO CONTROL THAT THEY ARE NORMAL OBJECTS
    Object.keys(asyncActions).forEach(actionKey => {
      config = {
        ...config,
        ...createActionsHandler(asyncActions[actionKey], asyncHandlers)
      }
    })
  }

  return config
}

/**
 * Creates A reducer using a default reducing function and a config with a property for each async state hook
 * If a reducer is not given the default one will be used
 * @param {Function} mainReducer Main reducer
 * @param {Object} payloadReducers Config object with the async hooks: start, done, reset and error
 */
const hookAsyncStates = (
  mainReducer = defaultReducer,
  payloadReducers = {}
) => (
  asyncActionType,
  currentPayload
) => {
  const { start, flush, done, error, reset } = getAsyncKeys(asyncActionType)
  return createReducer(
    currentPayload,
    {
      [start]: (payloadReducers.start || mainReducer),
      [done]: (payloadReducers.done || mainReducer),
      [flush]: (payloadReducers.flush || mainReducer),
      [reset]: (payloadReducers.reset || mainReducer),
      [error]: (payloadReducers.error || mainReducer)
    }
  )
}

const ASYNC_INITIAL_STATE = { status: null, payload: null, error: null }

/**
 * Create a reducer function to handle async actions
 * @param {*} intiialPayload Initial value of the payload, preferrably serializable
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 * @param {*} asyncHandlers Set of action reducers
 * @returns {function} async reducer
 */
export const createAsyncReducer = (intiialPayload = null, asyncActions, asyncHandlers) =>
  createReducer(
    {
      ...ASYNC_INITIAL_STATE,
      payload: intiialPayload
    },
    createAsyncReducerConfig(asyncActions, asyncHandlers)
  )

/*
// Example of the new implementation?

const getList = createAyncActions('GET_LIST')
const addItemToList = createAyncActions('ADD_ITEM_LIST')
const clearListError = createAction('CLEAR_LIST_ERROR')

getList.done([])

const newListReducer = createAsyncReducer(
  [], // intial value
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
  [], // intial value
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
  createAsyncReducerConfig,
  hookAsyncStates,
  defaultReducer
}
