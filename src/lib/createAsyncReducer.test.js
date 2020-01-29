/* global describe, test, expect */
import {
  _createAsyncReducerConfig,
  createAsyncReducerConfig,
  formatHandler,
  isValidConfig,
  mergeHandlers,
  createActionsHandler
} from './createAsyncReducer'
import createAsyncActions, { getAsyncKeys } from './createAsyncActions'

describe('Old api', () => {
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
})

describe('New api', () => {
  test('isValidConfig throws an error if the object format is incorrect', () => {
    expect(() => isValidConfig()).toThrowError()
    expect(() => isValidConfig(null)).toThrowError()
    expect(() => isValidConfig({ })).toThrowError()
    expect(() => isValidConfig({ done: null })).toThrowError()
    expect(() => isValidConfig({ done: null, start: () => {} })).toThrowError()
    expect(() => isValidConfig({ sugar: () => {}, start: () => {} })).toThrowError()
  })

  test('isValidConfig returns true if the object is completely valid', () => {
    const valid = isValidConfig({
      done: () => {}
    })

    expect(valid).toBeTruthy()
  })

  test('formatHandler succesfully formats a asyncAction to something understandable', () => {
    const actionOne = createAsyncActions('TEST_ONE')
    const formatted = formatHandler(actionOne)
    expect(formatted).toHaveProperty('TEST_ONE')
  })

  test('formatHandler succesfully formats a handler asyncAction keys to something understandable', () => {
    const actionOne = createAsyncActions('TEST_ONE')
    const formatted = formatHandler({ actionOne })
    expect(formatted).toHaveProperty('TEST_ONE')
  })

  test('formatHandler succesfully formats a handler asyncAction keys to something understandable', () => {
    const actionOne = createAsyncActions('TEST_ONE')
    const formatted = formatHandler({ [actionOne]: { done: () => null } })
    expect(formatted).toHaveProperty('TEST_ONE')
  })

  test('formatHandler throws an error if one of the handler is not defined', () => {
    expect(() => formatHandler()).toThrowError(/defined/)
  })

  test('formatHandler throws an error if one of the handler keys are not an object with hooks or an AsyncAction', () => {
    expect(() => formatHandler({ a: {} })).toThrowError(/hooks/)
    expect(() => formatHandler({ a: () => {} })).toThrowError(/hooks/)
  })

  test('formatHandler throws an error if the handler is not an object or an AsyncAction', () => {
    expect(() => formatHandler(() => {})).toThrowError(/actions\/objects/)
  })

  test('mergeHandlers succesfully merges all keys into an array', () => {
    const actionOne = createAsyncActions('TEST_ONE')
    const actionTwo = createAsyncActions('TEST_TWO')
    const actionThree = createAsyncActions('TEST_THREE')
    const merged = mergeHandlers(
      {
        [actionOne]: () => {},
        [actionTwo]: () => {}
      },
      {
        [actionThree]: () => {}
      }
    )
    expect(merged).toContain('TEST_ONE')
    expect(merged).toContain('TEST_TWO')
    expect(merged).toContain('TEST_THREE')
  })

  describe('createActionsHandler created by default', () => {
    const actions = getAsyncKeys('TEST')
    const handlers = createActionsHandler(
      actions
    )

    test('has all the async actions on it', () => {
      expect(handlers).toHaveProperty(actions.start)
      expect(handlers).toHaveProperty(actions.flush)
      expect(handlers).toHaveProperty(actions.done)
      expect(handlers).toHaveProperty(actions.error)
      expect(handlers).toHaveProperty(actions.reset)
    })
  })

  test('createAsyncReducerConfig returns a collection of actions', () => {
    const actions = createAsyncActions('TEST')
    const reducerConfig = createAsyncReducerConfig({ actions })

    expect(reducerConfig).toHaveProperty('START_TEST')
    expect(reducerConfig).toHaveProperty('DONE_TEST')
    expect(reducerConfig).toHaveProperty('ERROR_TEST')
    expect(reducerConfig).toHaveProperty('RESET_TEST')
  })

  test('createAsyncReducerConfig returns a sumarized collection of actions', () => {
    const actions = createAsyncActions('TEST')
    const actions2 = createAsyncActions('TEST2')
    const reducerConfig = createAsyncReducerConfig({
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

  test('createAsyncReducerConfig returns a sumarized collection of actions when they have mixed types', () => {
    const actions = createAsyncActions('TEST')
    const actions2 = createAsyncActions('TEST2')
    const reducerConfig = createAsyncReducerConfig({
      actions,
      [actions2]: { done: () => {} }
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
})
