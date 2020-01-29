/* global describe, test, expect */
import {
  createAsyncReducerConfig,
  createActionsHandler,
  getAsyncNodeReducer,
  defaultReducer,
  nullifierReducer,
  formatHandler,
  isValidConfig,
  mergeHandlers
} from './createAsyncReducer'
import createAsyncActions, { getAsyncKeys } from './createAsyncActions'

describe('New api', () => {
  describe('defaultReducer', () => {
    test('with default arguments ', () => {
      expect(defaultReducer()).toBe(null)
    })
  })

  describe('nullifierReducer', () => {
    test('with default arguments ', () => {
      expect(nullifierReducer()).toBe(null)
    })
  })

  describe('getAsyncNodeReducer', () => {
    test('with default arguments ', () => {
      const asyncReducer = getAsyncNodeReducer()

      expect(typeof asyncReducer).toBe('function')
    })
  })

  describe('isValidConfig', () => {
    test('throws an error if the object format is incorrect', () => {
      expect(isValidConfig()).toBeFalsy()
      expect(isValidConfig(null)).toBeFalsy()
      expect(isValidConfig(true)).toBeFalsy()
      expect(isValidConfig(Boolean(true))).toBeFalsy()
      expect(isValidConfig(new RegExp('a'))).toBeFalsy()
      expect(isValidConfig({ })).toBeFalsy()
      expect(isValidConfig({ done: null })).toBeFalsy()
      expect(isValidConfig({ done: null, start: () => {} })).toBeFalsy()
      expect(isValidConfig({ sugar: () => {}, start: () => {} })).toBeFalsy()
    })

    test('returns true if the object is completely valid', () => {
      const valid = isValidConfig({
        done: () => {}
      })

      expect(valid).toBeTruthy()
    })
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
    expect(() => formatHandler({ a: null })).toThrowError()
    expect(() => formatHandler({ a: true })).toThrowError()
    expect(() => formatHandler({ a: Boolean(true) })).toThrowError()
    expect(() => formatHandler({ a: new RegExp('a') })).toThrowError()
    expect(() => formatHandler({ a: { } })).toThrowError()
    expect(() => formatHandler({ a: { done: null } })).toThrowError()
    expect(() => formatHandler({ a: { done: null, start: () => {} } })).toThrowError()
    expect(() => formatHandler({ a: { sugar: () => {}, start: () => {} } })).toThrowError()
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

  describe('createActionsHandler', () => {
    describe('created by default', () => {
      const actions = getAsyncKeys('TEST')
      const handlers = createActionsHandler(
        actions
      )

      test('has all the async actions on it', () => {
        expect(handlers).toHaveProperty(actions.start)
        expect(handlers).toHaveProperty(actions.progress)
        expect(handlers).toHaveProperty(actions.done)
        expect(handlers).toHaveProperty(actions.error)
        expect(handlers).toHaveProperty(actions.reset)
      })
    })

    describe('created with simple config', () => {
      const actions = getAsyncKeys('TEST')
      const handlers = createActionsHandler(
        actions,
        {
          done: () => null
        }
      )

      test('has all the async actions on it', () => {
        expect(handlers).toHaveProperty(actions.start)
        expect(handlers).toHaveProperty(actions.progress)
        expect(handlers).toHaveProperty(actions.done)
        expect(handlers).toHaveProperty(actions.error)
        expect(handlers).toHaveProperty(actions.reset)
      })
    })

    describe('created with complex config', () => {
      const actions = getAsyncKeys('TEST')
      const handlers = createActionsHandler(
        actions,
        {
          done: () => null
        },
        {
          done: () => null
        }
      )

      test('has all the async actions on it', () => {
        expect(handlers).toHaveProperty(actions.start)
        expect(handlers).toHaveProperty(actions.progress)
        expect(handlers).toHaveProperty(actions.done)
        expect(handlers).toHaveProperty(actions.error)
        expect(handlers).toHaveProperty(actions.reset)
      })
    })
  })

  test('createAsyncReducerConfig returns a error if no actions where used', () => {
    expect(() => createAsyncReducerConfig()).toThrowError()
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
    const reducerConfig = createAsyncReducerConfig(
      {
        actions
      },
      {
        [actions2]: { done: () => {} }
      }
    )
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
