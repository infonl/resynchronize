import { AsyncActions } from './createAsyncActions'
import { createReducer } from './utils'

/**
 * Handlers for async actions
 * The reducer is used on the afected property to avoid structure changes on how the library behaves
 * Status is managed by the library and cannot be altered, but the payloads can be updated using custom
 * reducers
 */
const handleStart = reducer => (state, action) => ({
  status: 'START',
  payload: reducer(state.payload, action),
  error: null
})

const handleDone = reducer => (state, action) => ({
  status: 'DONE',
  payload: reducer(state.payload, action),
  error: null
})

const handleError = reducer => (state, action) => ({
  status: 'ERROR',
  payload: state.payload,
  error: reducer(state.error, action)
})

const handleReset = reducer => (state, action) => ({
  status: null,
  payload: reducer(state.payload, action),
  error: null
})

/** default reducer for async handling */
const defaultReducer = (state = null, { payload = null }) => payload || state

/**
 * Basic action handler creator for async actions
 * @param {object} actions Async actions
 */
const createActionsHandler = (actions, { start, done, reset, error } = {}) => ({
  [actions.start]: handleStart(start || defaultReducer),
  [actions.done]: handleDone(done || defaultReducer),
  [actions.error]: handleError(error || defaultReducer),
  [actions.reset]: handleReset(reset || defaultReducer)
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

export {
  createAsyncReducer as default,
  createAsyncReducerConfig,
  defaultReducer
}
