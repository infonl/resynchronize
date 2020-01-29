/* global test, expect, describe */
import createAsyncActions from './createAsyncActions'
import createAsyncReducer from './createAsyncReducer'
import { getStateShape, STARTED, isDone, getPayload, getError } from './utils'

describe('Integration tests', () => {
  const actions = createAsyncActions('LIST')
  const reducer = createAsyncReducer(null, actions)

  test('should be able to handle START action', () => {
    expect(reducer(undefined, actions.start())).toEqual(getStateShape(STARTED))
  })

  test('should be able to handle DONE action', () => {
    const state = reducer(undefined, actions.done('test-payload'))

    expect(isDone(state)).toBeTruthy()
    expect(getPayload(state)).toBe('test-payload')
    expect(getError(state)).toBeFalsy()
  })

  test('should be able to handle ERROR action', () => {
    const state = reducer(undefined, actions.error('error'))

    expect(isDone(state)).toBeTruthy()
    expect(getPayload(state)).toBe(null)
    expect(getError(state)).toBe('error')
  })

  test('should be able to handle RESET action with state after START', () => {
    const state = reducer(undefined, actions.start())
    expect(reducer(state, actions.reset())).toEqual({
      status: null,
      error: null,
      payload: null
    })
  })

  test('should be able to handle RESET action with state after DONE', () => {
    const state = reducer(undefined, actions.done('test-payload'))
    expect(reducer(state, actions.reset())).toEqual({
      status: null,
      error: null,
      payload: null
    })
  })

  test('should be able to handle RESET action with state after ERROR', () => {
    const state = reducer(undefined, actions.error('error'))
    expect(reducer(state, actions.reset())).toEqual({
      status: null,
      error: null,
      payload: null
    })
  })
})
