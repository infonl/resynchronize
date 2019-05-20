import createAsyncActions from './createAsyncActions';
import createAsyncReducer from './createAsyncReducer'

describe('Integration tests', () => {
  const actions = createAsyncActions('LIST');
  const reducer = createAsyncReducer(actions);

  test('should be able to handle START action', () => {
    expect(reducer(undefined, actions.START())).toEqual({
      status: 'START',
      error: null,
      payload: null
    })
  })

  test('should be able to handle DONE action', () => {
    expect(reducer(undefined, actions.DONE('test-payload'))).toEqual({
      status: 'DONE',
      error: null,
      payload: 'test-payload'
    })
  })

  test('should be able to handle ERROR action', () => {
    expect(reducer(undefined, actions.ERROR('error'))).toEqual({
      status: 'ERROR',
      error: 'error',
      payload: null
    })
  })

  test('should be able to handle RESET action with state after START', () => {
    const state = reducer(undefined, actions.START());
    expect(reducer(state, actions.RESET())).toEqual({
      status: null,
      error: null,
      payload: null
    })
  })

  test('should be able to handle RESET action with state after DONE', () => {
    const state = reducer(undefined, actions.DONE('test-payload'));
    expect(reducer(state, actions.RESET())).toEqual({
      status: null,
      error: null,
      payload: 'test-payload'
    })
  })

  test('should be able to handle RESET action with state after ERROR', () => {
    const state = reducer(undefined, actions.ERROR('error'));
    expect(reducer(state, actions.RESET())).toEqual({
      status: null,
      error: null,
      payload: null
    })
  })
})