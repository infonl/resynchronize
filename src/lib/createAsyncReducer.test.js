/* global test, expect */
const createAsyncReducer = require('./createAsyncReducer')
const createAsyncActions = require('./createAsyncActions')

test('createAsyncReducerConfig returns a collection of actions', () => {
  const actions = createAsyncActions.default('TEST')
  const reducerConfig = createAsyncReducer.createAsyncReducerConfig(actions)

  expect(reducerConfig).toHaveProperty('START_TEST')
  expect(reducerConfig).toHaveProperty('DONE_TEST')
  expect(reducerConfig).toHaveProperty('ERROR_TEST')
  expect(reducerConfig).toHaveProperty('RESET_TEST')
})

test('createAsyncReducerConfig returns a sumarized collection of actions', () => {
  const actions = createAsyncActions.default('TEST')
  const actions2 = createAsyncActions.default('TEST2')
  const reducerConfig = createAsyncReducer.createAsyncReducerConfig({
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
