const get = (asyncNode, property, defaultValue) => {
  const result = asyncNode == null ? undefined : asyncNode[property]
  return result === undefined ? defaultValue : result
}

// Basic set of functions to manage the state of async actions and reducers
export const isDone = asyncStatus => get(asyncStatus, 'status', false) === 'DONE'
export const getError = asyncStatus => get(asyncStatus, 'status', false) === 'ERROR' && get(asyncStatus, 'error', null)
export const isLoading = asyncStatus => get(asyncStatus, 'status', false) === 'START'
export const getPayload = asyncStatus => get(asyncStatus, 'payload', null)

/**
 * Gets the async state properties for connection
 * @param {object} asyncProp Async state property
 */
export const getAsyncProperties = (asyncProp) => ({
  payload: getPayload(asyncProp),
  loading: isLoading(asyncProp),
  done: isDone(asyncProp),
  error: getError(asyncProp)
})

/**
 * Fuses in one property the given argument properties
 * @param {any} previous previous property
 * @param {any} connected connected property
 */
const fuseProps = (own, connected) => {
  let newProp = connected

  if (typeof own !== 'undefined') {
    newProp = {
      own,
      connected
    }
  }

  return newProp
}

const getAsyncKeys = getter => {
  let asyncProps = ['asyncProp']

  if (typeof getter === 'object') {
    asyncProps = Object.keys(getter).map(key => key)
  }

  return asyncProps
}

export const getGetterAsyncProps = (state, props) => {
  const { getter } = props

  let newAsyncProps = {}

  getAsyncKeys(getter).forEach(key => {
    const newProp = getAsyncProperties(
      getter[key](state)
    )
    newAsyncProps[key] = fuseProps(props[key], newProp)
  })

  return newAsyncProps
}

/**
 * Basic action structure
 * @param {string} type unique identifier for the store
 * @return {funtion} action creator that returns an object with type and payload
 */
function Action (type) {
  return (payload = null) => ({ type, payload })
}

export const createAction = type => {
  const action = new Action(type)
  action.toString = () => type
  action.type = type
  return action
}

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
export const createAsyncActions = storeKey => new AsyncActions(storeKey)

const ASYNC_INITIAL_STATE = { status: null, payload: null, error: null }

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
export const defaultReducer = (state, { payload }) => payload || state || null

/**
 * Basic action handler creator for async actions
 * @param {object} actions Async actions
 */
const createActionsHandler = (actions, { start, done, reset, error } = {}) => ({
  [actions.START]: handleStart(start || defaultReducer),
  [actions.DONE]: handleDone(done || defaultReducer),
  [actions.ERROR]: handleError(error || defaultReducer),
  [actions.RESET]: handleReset(reset || defaultReducer)
})

/**
 * Create a reducer config to handle async actions
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 * @param {*} asyncHandlers Set of action reducers
 * @returns {object} config to be used on a reducer
 */
export const createAsyncReducerConfig = (asyncActions, asyncHandlers) => {
  let config = {}

  // If isnt an AsyncActions all the keys of the object are put into the main reducer
  if (AsyncActions.prototype.isPrototypeOf(asyncActions)) {
    config = createActionsHandler(asyncActions, asyncHandlers)
  } else {
    Object.keys(asyncActions).forEach(actionKey => {
      config = {
        ...config,
        ...createActionsHandler(asyncActions[actionKey], asyncHandlers)
      }
    })
  }

  return config
}

const createReducer = (initialState, actionMap) => (state = initialState, action) => {
  let newState = state

  Object.keys(actionMap).forEach(actionKey => {
    newState = actionMap[actionKey](state, action)
  })

  return newState
}

/**
 * Create a reducer function to handle async actions
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 * @param {*} asyncHandlers Set of action reducers
 * @returns {function} async reducer
 */
export const createAsyncReducer = (asyncActions, asyncHandlers) =>
  createReducer(
    ASYNC_INITIAL_STATE,
    createAsyncReducerConfig(asyncActions, asyncHandlers)
  )
