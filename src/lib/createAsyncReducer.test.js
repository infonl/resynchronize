/* global test, expect */
import { _createAsyncReducerConfig } from './createAsyncReducer'
import createAsyncActions from './createAsyncActions'

test('createAsyncReducerConfig returns a collection of actions', () => {
  const actions = createAsyncActions('TEST')
  const reducerConfig = _createAsyncReducerConfig(actions)

  expect(reducerConfig).toHaveProperty('START_TEST')
  expect(reducerConfig).toHaveProperty('DONE_TEST')
  expect(reducerConfig).toHaveProperty('ERROR_TEST')
  expect(reducerConfig).toHaveProperty('RESET_TEST')
})

test('createAsyncReducerConfig returns a sumarized collection of actions', () => {
  const actions = createAsyncActions('TEST')
  const actions2 = createAsyncActions('TEST2')
  const reducerConfig = _createAsyncReducerConfig({
    actions,
    actions2
  })
  expect(reducerConfig).toHaveProperty('START_TEST')
  expect(reducerConfig).toHaveProperty('DONE_TEST')
  expect(reducerConfig).toHaveProperty('ERROR_TEST')
  expect(reducerConfig).toHaveProperty('RESET_TEST')
  expect(reducerConfig).toHaveProperty('START_TEST2')
  expect(reducerConfig).toHaveProperty('DONE_TEST2')
  expect(reducerConfig).toHaveProperty('ERROR_TEST2')
  expect(reducerConfig).toHaveProperty('RESET_TEST2')
})
