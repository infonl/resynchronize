const INTIAL = null
const STARTED = 'STARTED'
const DONE = 'DONE'
const ERROR = 'ERROR'

const get = (object, property, defaultValue) => object
  ? object[property] || defaultValue
  : defaultValue

// Basic set of functions to manage the state of async actions and reducers
const isDone = asyncStatus => get(asyncStatus, 'status') === DONE
const getError = asyncStatus => get(asyncStatus, 'status') === ERROR && get(asyncStatus, 'error', null)
const isLoading = asyncStatus => get(asyncStatus, 'status') === STARTED
const getPayload = asyncStatus => get(asyncStatus, 'payload', null)

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
  INTIAL,
  STARTED,
  DONE,
  ERROR,
  get,
  createAction,
  createReducer,
  isDone,
  getError,
  isLoading,
  getPayload
}
