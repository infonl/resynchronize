const INITIAL = null
const STARTED = 'STARTED'
const DONE = 'DONE'
const ERROR = 'ERROR'
const CANCELLED = 'CANCELLED'

const get = (object, property, defaultValue) => object
  ? object[property] || defaultValue
  : defaultValue

// Basic set of functions to manage the state of async actions and reducers
const isDone = asyncStatus => get(asyncStatus, 'status') === DONE || get(asyncStatus, 'status') === ERROR
const getError = asyncStatus => {
  const status = get(asyncStatus, 'status')
  return (status === ERROR || status === CANCELLED) && get(asyncStatus, 'error', null)
}
const isLoading = asyncStatus => get(asyncStatus, 'status') === STARTED
const isCancelled = asyncStatus => get(asyncStatus, 'status') === CANCELLED
const getPayload = asyncStatus => get(asyncStatus, 'payload', null)

const getStateShape = (status = INITIAL, payload = null, error = null) => ({
  status, payload, error
})

/**
 * Basic action structure
 * @param {string} type unique identifier for the store
 * @return {funtion} action creator that returns an object with type and payload
 */
function Action (type) {
  return (payload = null) => ({ type, payload })
}

const createAction = type => {
  const action = new Action(type)
  action.toString = () => type
  action.type = type
  return action
}

const createReducer = (initialState, actionMap) => (state = initialState, action = {}) =>
  typeof actionMap[action.type] === 'function'
    ? actionMap[action.type](state, action)
    : state

export {
  INITIAL,
  STARTED,
  DONE,
  ERROR,
  CANCELLED,
  get,
  getStateShape,
  createAction,
  createReducer,
  isDone,
  getError,
  isCancelled,
  isLoading,
  getPayload
}
