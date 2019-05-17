const get = (asyncNode, property, defaultValue) => {
  const result = asyncNode == null ? undefined : asyncNode[property]
  return result === undefined ? defaultValue : result
}

// Basic set of functions to manage the state of async actions and reducers
const isDone = asyncStatus => get(asyncStatus, 'status', false) === 'DONE'
const getError = asyncStatus => get(asyncStatus, 'status', false) === 'ERROR' && get(asyncStatus, 'error', null)
const isLoading = asyncStatus => get(asyncStatus, 'status', false) === 'START'
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

const createReducer = (initialState, actionMap) => (state = initialState, action) => {
  let newState = state

  Object.keys(actionMap).forEach(actionKey => {
    newState = actionMap[actionKey](state, action)
  })

  return newState
}

export {
  get,
  createAction,
  createReducer,
  isDone,
  getError,
  isLoading,
  getPayload
}
