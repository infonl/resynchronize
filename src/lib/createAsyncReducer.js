import { AVAILABLE_ACTIONS, INITIAL, STARTED, DONE, ERROR, CANCELLED } from './consts'
import { getAsyncKeys, isAsyncActions } from './createAsyncActions'
import { createReducer, getStateShape } from './utils'

/** default reducer for async handling */
const defaultReducer = (state = null, { payload = null } = {}) => payload || state

const initialValueReducer = initialValue => () => initialValue || null

const nullifierReducer = () => null

/**
 * Async node reducer builder
 * @param {String*} status Desired status on the final node
 * @param {*} payloadReducer Payload reducer
 * @param {*} errorReducer Error reducer
 * @returns {function} Reducer
 */
const getAsyncNodeReducer = (
  status = INITIAL,
  payloadReducer = defaultReducer,
  errorReducer = defaultReducer
) => (
  state,
  action
) => ({
  status,
  payload: payloadReducer(state.payload, action),
  error: errorReducer(state.error, action)
})

/**
 * Checks the config properties
 * @param {*} config
 */
const checkProps = (config) => {
  const keys = Object.keys(config)
  return !!keys.length && Object.keys(config).every(key => AVAILABLE_ACTIONS.includes(key) && typeof config[key] === 'function')
}

/**
 * Checks if the object has a shape that can be used to build the reducers
 * @param {*} config Property to be checked
 */
const isValidConfig = config => {
  // At least one of the properties is present AND is a function
  return config instanceof Object ? checkProps(config) : false
}

/**
 * Handlers for async actions
 * The reducer is used on the afected property to avoid structure changes on how the library behaves
 * Status is managed by the library and cannot be altered, but the payloads can be updated using custom
 * reducers
 */
const handleStart = (payloadReducer, errorReducer = nullifierReducer) =>
  getAsyncNodeReducer(STARTED, payloadReducer, errorReducer)

const handleProgress = (payloadReducer, errorReducer = nullifierReducer) =>
  getAsyncNodeReducer(STARTED, payloadReducer, errorReducer)

const handleDone = (payloadReducer, errorReducer = nullifierReducer) =>
  getAsyncNodeReducer(DONE, payloadReducer, errorReducer)

const handleError = (payloadReducer = nullifierReducer, errorReducer) =>
  getAsyncNodeReducer(ERROR, payloadReducer, errorReducer)

const handleCancel = (payloadReducer = nullifierReducer, errorReducer) =>
  getAsyncNodeReducer(CANCELLED, payloadReducer, errorReducer)

// @TODO to initial value??
const handleReset = (initialPayload) =>
  (payloadReducer = initialValueReducer(initialPayload), errorReducer = nullifierReducer) =>
    getAsyncNodeReducer(INITIAL, payloadReducer, errorReducer)

/**
 * Basic action handler creator for async actions
 * @param {object} actions Async actions
 * @param {object} payloadReducers Object with a key for every reducer on every state
 * @param {object} errorReducers Object with a key for every reducer on every state
 */
const createActionsHandler = (initialPayload, actions, payloadReducers = {}, errorReducers = {}) => ({
  [actions.start]: handleStart(payloadReducers.start, errorReducers.start),
  [actions.progress]: handleProgress(payloadReducers.progress, errorReducers.flush),
  [actions.done]: handleDone(payloadReducers.done, errorReducers.done),
  [actions.error]: handleError(payloadReducers.error, errorReducers.error),
  [actions.cancel]: handleCancel(payloadReducers.cancel, errorReducers.cancel),
  [actions.reset]: handleReset(initialPayload)(payloadReducers.reset, errorReducers.reset)
})

/**
 * Formats an individual handler to shape it to asyncActionKey => object => reducers
 * @param {Object} handler Any object containing the key that are either asyncActionObjects or objects with the reducer hooks
 */
const formatHandler = (handler) => {
  let formatted = {}
  if (handler) {
    if (isAsyncActions(handler)) {
      formatted = { [handler]: {} }
    } else if (typeof handler === 'object') {
      formatted = Object.keys(handler).reduce((current, prop) => {
        if (isAsyncActions(handler[prop])) {
          current[handler[prop]] = {}
        } else if (isValidConfig(handler[prop])) {
          current[prop] = handler[prop]
        } else {
          throw new Error(`
            The handler must be an AsyncAction or a config object for with one of the async hooks properties:
            ${AVAILABLE_ACTIONS.join()}
          `)
        }

        return current
      }, {})
    } else {
      throw new Error('The handler must be an object with async actions/objects or async actions objects')
    }
  } else {
    throw new Error('The handler must be defined')
  }
  return formatted
}

/**
 * Given a set of objects as arguments, each one of those containing the async key identifiers, merges them all and eliminates
 * repeated ones
 * @param  {Object} payload Payload handlers with reducers
 * @param  {Object} error Error handlers with reducers
 * @return {Array} Handler keys merged without repetition
 */
const mergeHandlers = (payload, error) => {
  const handlers = new Set(Object.keys(payload).concat(Object.keys(error)))
  return [...handlers]
}

/**
 * Create a reducer config to handle async actions
 * @param {*} payloadHandlers Set of actions that include every state of a fetch process
 * @param {*} errorHandlers Set of actions that include every state of a fetch process
 * @returns {object} config to be used on a reducer
 */
const createAsyncReducerConfig = (initialPayload, payloadHandlers, errorHandlers = {}) => {
  const formattedPayloadHandlers = formatHandler(payloadHandlers)
  const formattedErrorHandlers = formatHandler(errorHandlers)

  return mergeHandlers(formattedPayloadHandlers, formattedErrorHandlers).reduce(
    (config, asyncKey) => {
      const payloadHandler = formattedPayloadHandlers[asyncKey]
      const errorHandler = formattedErrorHandlers[asyncKey]

      return {
        ...config,
        ...createActionsHandler(
          initialPayload,
          getAsyncKeys(asyncKey),
          payloadHandler,
          errorHandler
        )
      }
    },
    {}
  )
}

/**
 * Create a reducer function to handle async actions
 * @param {*} intiialPayload Initial value of the payload, preferrably serializable
 * @param {Function} payloadReducer Function used to reduce the payload on the different states
 * @param {Function} errorReducerConfig Function used to reduce the error on the different states
 */
const createAsyncReducer = (initialPayload, payloadHandlers, errorHandlers) =>
  createReducer(
    getStateShape(INITIAL, initialPayload, null),
    createAsyncReducerConfig(initialPayload, payloadHandlers, errorHandlers)
  )

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

// simplied version
const newListReducer = createAsyncReducer(
  [], // INITIAL value
  { // MAIN PAYLOAD CONFIG
    // reducer for the async actions, can be filtered by status
    getList,
    addItemToList
  },
  { // ERROR PAYLOAD CONFIG
    [getList]: {
      start: (currentError, action) => null // Start
      done: (currentError, action) => null // Done
      error: (currentError, action) => action.payload // Error
    }
  }
)

const newListReducer = createAsyncReducer(
  [], // INITIAL value
  getList
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
  createAsyncReducerConfig,
  createActionsHandler,
  getAsyncNodeReducer,
  isValidConfig,
  formatHandler,
  mergeHandlers,
  defaultReducer,
  nullifierReducer
}
