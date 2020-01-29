/* global test, expect, describe */
import createAsyncActions from './createAsyncActions'
import createAsyncReducer from './createAsyncReducer'

describe('Integration tests', () => {
  const actions = createAsyncActions('LIST')
  const reducer = createAsyncReducer(actions)

  test('should be able to handle START action', () => {
    expect(reducer(undefined, actions.start())).toEqual({
      status: 'START',
      error: null,
      payload: null
    })
  })

  test('should be able to handle DONE action', () => {
    expect(reducer(undefined, actions.done('test-payload'))).toEqual({
      status: 'DONE',
      error: null,
      payload: 'test-payload'
    })
  })

  test('should be able to handle ERROR action', () => {
    expect(reducer(undefined, actions.error('error'))).toEqual({
      status: 'ERROR',
      error: 'error',
      payload: null
    })
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
      payload: 'test-payload'
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
