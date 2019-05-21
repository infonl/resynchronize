/* global test, expect, describe */
const utils = require('./utils')

describe('createAction', () => {
  const action = utils.createAction('TEST')

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
  const asyncNode = { status: null, payload: null, error: null }

  test('isDone returns false', () => {
    expect(utils.isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns false', () => {
    expect(utils.isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns null', () => {
    expect(utils.getPayload(asyncNode)).toBeFalsy()
  })

  test('getError returns false', () => {
    expect(utils.getError(asyncNode)).toBeFalsy()
  })
})

describe('started state', () => {
  const asyncNode = { status: 'START', payload: null, error: null }

  test('isDone returns false', () => {
    expect(utils.isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns true', () => {
    expect(utils.isLoading(asyncNode)).toBeTruthy()
  })

  test('getPayload returns null', () => {
    expect(utils.getPayload(asyncNode)).toBeFalsy()
  })

  test('getError returns false', () => {
    expect(utils.getError(asyncNode)).toBeFalsy()
  })
})

describe('done state', () => {
  const asyncNode = { status: 'DONE', payload: 'hello world!', error: null }

  test('isDone returns true', () => {
    expect(utils.isDone(asyncNode)).toBeTruthy()
  })

  test('isLoading returns false', () => {
    expect(utils.isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns the payload', () => {
    expect(utils.getPayload(asyncNode)).toBe(asyncNode.payload)
  })

  test('getError returns false', () => {
    expect(utils.getError(asyncNode)).toBeFalsy()
  })
})

describe('error state', () => {
  const asyncNode = { status: 'ERROR', payload: 'hello world!', error: 'Some error!' }

  test('isDone returns false', () => {
    expect(utils.isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns true', () => {
    expect(utils.isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns the payload', () => {
    expect(utils.getPayload(asyncNode)).toBe(asyncNode.payload)
  })

  test('error returns the error', () => {
    expect(utils.getError(asyncNode)).toBe(asyncNode.error)
  })
})

describe('get', () => {
  const obj = { prop: 'value' }

  test('shoud return the value of existing property', () => {
    expect(utils.get(obj, 'prop')).toBe('value')
    expect(utils.get(obj, 'prop', 'default')).toBe('value')
  })

  test('should return default value if property does not exist', () => {
    expect(utils.get(obj, 'fakeProp', 'default')).toBe('default')
  })

  test('shoud return "undefined" if property does not exist and no default value specified', () => {
    expect(utils.get(obj, 'fakeProp')).toBeUndefined()
    expect(utils.get(null, 'fakeProp')).toBeUndefined()
    expect(utils.get(undefined, 'fakeProp')).toBeUndefined()
  })

  test('should return default value if target object is null or undefined', () => {
    expect(utils.get(null, 'prop', 'default')).toBe('default')
    expect(utils.get(undefined, 'prop', 'default')).toBe('default')
  })
})

describe('createReducer', () => {
  const initialState = 'test-state'

  test('shoud return "initialState" if current state is "undefined" and no action match in "actionMap"', () => {
    const actionMap = {}
    const action = { type: 'DONE_TEST', payload: 'test-payload' }
    const reducer = utils.createReducer(initialState, actionMap)
    expect(reducer(undefined, action)).toBe(initialState)
  })

  test('should return last state if no action match in "actionMap"', () => {
    const actionMap = {}
    const action = { type: 'DONE_TEST', payload: 'test-payload' }
    const reducer = utils.createReducer(initialState, actionMap)
    expect(reducer('current-state', action)).toBe('current-state')
  })

  test('should return a new state if there is a match for action in "actionMap"', () => {
    const actionMap = { DONE_TEST: (state, { payload }) => state + payload }
    const action = { type: 'DONE_TEST', payload: '-modified' }
    const reducer = utils.createReducer(initialState, actionMap)
    expect(reducer('current-state', action)).toBe('current-state-modified')
  })

  test('should return a new state if there is a match for multiple actions in "actionMap"', () => {
    const actionStart = utils.createAction('START_TEST')
    const actionDone = utils.createAction('DONE_TEST')

    const actionMap = {
      [actionStart]: (state, { payload }) => `${state}-started${payload || ''}`,
      [actionDone]: (state, { payload }) => `${state}-done${payload || ''}`
    }

    const reducer = utils.createReducer(initialState, actionMap)
    const startState = reducer('current-state', actionStart('-asdasd'))
    const doneState = reducer(startState, actionDone('-qwerty'))

    expect(startState).toBe('current-state-started-asdasd')
    expect(doneState).toBe('current-state-started-asdasd-done-qwerty')
  })
})
