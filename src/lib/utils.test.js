/* global test, expect, describe */
import {
  getStateShape,
  INITIAL, STARTED, DONE, ERROR,
  createAction,
  createReducer,
  isDone,
  isLoading,
  getPayload,
  getError,
  get,
  CANCELLED
} from './utils'

describe('getStateShape', () => {
  describe('when is initialized by default', () => {
    const state = getStateShape()

    test('contains three properties', () => {
      expect(state).toHaveProperty('status')
      expect(state).toHaveProperty('payload')
      expect(state).toHaveProperty('error')
    })

    test('all properties are defaulted', () => {
      expect(state.status).toBe(INITIAL)
      expect(state.payload).toBe(null)
      expect(state.error).toBe(null)
    })
  })

  describe('when is initialized by with values', () => {
    const state = getStateShape(STARTED, 'ok', 'error')

    test('contains three properties', () => {
      expect(state).toHaveProperty('status')
      expect(state).toHaveProperty('payload')
      expect(state).toHaveProperty('error')
    })

    test('all properties are defined with the arguments values', () => {
      expect(state.status).toBe(STARTED)
      expect(state.payload).toBe('ok')
      expect(state.error).toBe('error')
    })
  })
})

describe('createAction', () => {
  const action = createAction('TEST')

  test('can be stringified to its type', () => {
    expect(`${action}`).toBe('TEST')
    expect(`${action.type}`).toBe('TEST')
  })

  test('when called returns an object with type and payload', () => {
    const dispatchable = action()
    expect(dispatchable).toHaveProperty('type')
    expect(dispatchable.type).toBe('TEST')
    expect(dispatchable.payload).toBe(null)
  })

  test('when called with an argument returns an object with type and the argument as payload', () => {
    const dispatchable = action('something')
    expect(dispatchable).toHaveProperty('type')
    expect(dispatchable.type).toBe('TEST')
    expect(dispatchable.payload).toBe('something')
  })
})

describe('initial state', () => {
  const asyncNode = getStateShape()

  test('isDone returns false', () => {
    expect(isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns false', () => {
    expect(isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns null', () => {
    expect(getPayload(asyncNode)).toBeFalsy()
  })

  test('getError returns false', () => {
    expect(getError(asyncNode)).toBeFalsy()
  })
})

describe('started state', () => {
  const asyncNode = getStateShape(STARTED)

  test('isDone returns false', () => {
    expect(isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns true', () => {
    expect(isLoading(asyncNode)).toBeTruthy()
  })

  test('getPayload returns null', () => {
    expect(getPayload(asyncNode)).toBeFalsy()
  })

  test('getError returns false', () => {
    expect(getError(asyncNode)).toBeFalsy()
  })
})

describe('done state', () => {
  const asyncNode = getStateShape(DONE, 'hello world!')

  test('isDone returns true', () => {
    expect(isDone(asyncNode)).toBeTruthy()
  })

  test('isLoading returns false', () => {
    expect(isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns the payload', () => {
    expect(getPayload(asyncNode)).toBe(asyncNode.payload)
  })

  test('getError returns false', () => {
    expect(getError(asyncNode)).toBeFalsy()
  })
})

describe('error state', () => {
  const asyncNode = getStateShape(ERROR, 'hello world!', 'Some error!')

  test('isDone returns false', () => {
    expect(isDone(asyncNode)).toBeTruthy()
  })

  test('isLoading returns true', () => {
    expect(isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns the payload', () => {
    expect(getPayload(asyncNode)).toBe(asyncNode.payload)
  })

  test('error returns the error', () => {
    expect(getError(asyncNode)).toBe(asyncNode.error)
  })
})

describe('cancelled state', () => {
  const asyncNode = getStateShape(CANCELLED, null, 'cancelled')

  test('isDone returns false', () => {
    expect(isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns true', () => {
    expect(isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns the payload', () => {
    expect(getPayload(asyncNode)).toBe(null)
  })

  test('error returns the error', () => {
    expect(getError(asyncNode)).toBe(asyncNode.error)
  })
})

describe('get', () => {
  const obj = { prop: 'value' }

  test('shoud return the value of existing property', () => {
    expect(get(obj, 'prop')).toBe('value')
    expect(get(obj, 'prop', 'default')).toBe('value')
  })

  test('should return default value if property does not exist', () => {
    expect(get(obj, 'fakeProp', 'default')).toBe('default')
  })

  test('shoud return "undefined" if property does not exist and no default value specified', () => {
    expect(get(obj, 'fakeProp')).toBeUndefined()
    expect(get(null, 'fakeProp')).toBeUndefined()
    expect(get(undefined, 'fakeProp')).toBeUndefined()
  })

  test('should return default value if target object is null or undefined', () => {
    expect(get(null, 'prop', 'default')).toBe('default')
    expect(get(undefined, 'prop', 'default')).toBe('default')
  })
})

describe('createReducer', () => {
  const initialState = 'test-state'

  test('shoud return "initialState" if current state is "undefined" and no action match in "actionMap"', () => {
    const actionMap = {}
    const action = { type: 'DONE_TEST', payload: 'test-payload' }
    const reducer = createReducer(initialState, actionMap)
    expect(reducer(undefined, action)).toBe(initialState)
  })

  test('should return last state if no action match in "actionMap"', () => {
    const actionMap = {}
    const action = { type: 'DONE_TEST', payload: 'test-payload' }
    const reducer = createReducer(initialState, actionMap)
    expect(reducer('current-state', action)).toBe('current-state')
  })

  test('should return a new state if there is a match for action in "actionMap"', () => {
    const actionMap = { DONE_TEST: (state, { payload }) => state + payload }
    const action = { type: 'DONE_TEST', payload: '-modified' }
    const reducer = createReducer(initialState, actionMap)
    expect(reducer('current-state', action)).toBe('current-state-modified')
  })

  test('should return a new state if there is a match for multiple actions in "actionMap"', () => {
    const actionStart = createAction('START_TEST')
    const actionDone = createAction('DONE_TEST')

    const actionMap = {
      [actionStart]: (state, { payload }) => `${state}-started${payload || ''}`,
      [actionDone]: (state, { payload }) => `${state}-done${payload || ''}`
    }

    const reducer = createReducer(initialState, actionMap)
    const startState = reducer('current-state', actionStart('-asdasd'))
    const doneState = reducer(startState, actionDone('-qwerty'))

    expect(startState).toBe('current-state-started-asdasd')
    expect(doneState).toBe('current-state-started-asdasd-done-qwerty')
  })
})
