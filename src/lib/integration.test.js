/* global test, expect, describe */
import createAsyncActions from './createAsyncActions'
import createAsyncReducer, { _createAsyncReducer } from './createAsyncReducer'
import { getStateShape, STARTED, isDone, getPayload, getError } from './utils'

describe('Old API', () => {
  describe('Integration tests', () => {
    const actions = createAsyncActions('LIST')
    const reducer = _createAsyncReducer(null, actions)

    test('should be able to handle START action', () => {
      expect(reducer(undefined, actions.start())).toEqual(getStateShape(STARTED))
    })

    test('should be able to handle FLUSH action', () => {
      const state = reducer(undefined, actions.flush('test-payload'))

      expect(isDone(state)).toBeFalsy()
      expect(getPayload(state)).toBe('test-payload')
      expect(getError(state)).toBeFalsy()
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

    test('should be able to handle CANCEL action', () => {
      const state = reducer(undefined, actions.cancel())

      expect(isDone(state)).toBeFalsy()
      expect(getPayload(state)).toBe(null)
      expect(getError(state)).toBe('cancelled')
    })

    test('should be able to handle RESET action with state after START', () => {
      const state = reducer(undefined, actions.start())
      const newState = reducer(state, actions.reset())

      expect(isDone(newState)).toBeFalsy()
      expect(getPayload(newState)).toBe(null)
      expect(getError(newState)).toBeFalsy()
    })

    test('should be able to handle RESET action with state after flush', () => {
      const state = reducer(undefined, actions.flush('test-payload'))
      const newState = reducer(state, actions.reset())

      expect(isDone(newState)).toBeFalsy()
      expect(getPayload(newState)).toBe(null)
      expect(getError(newState)).toBeFalsy()
    })

    test('should be able to handle RESET action with state after DONE', () => {
      const state = reducer(undefined, actions.done('test-payload'))
      const newState = reducer(state, actions.reset())

      expect(isDone(newState)).toBeFalsy()
      expect(getPayload(newState)).toBe(null)
      expect(getError(newState)).toBeFalsy()
    })

    test('should be able to handle RESET action with state after ERROR', () => {
      const state = reducer(undefined, actions.error('error'))
      const newState = reducer(state, actions.reset())

      expect(isDone(newState)).toBeFalsy()
      expect(getPayload(newState)).toBe(null)
      expect(getError(newState)).toBeFalsy()
    })
  })
})

describe('New API', () => {
  describe('Integration tests', () => {
    const actions = createAsyncActions('LIST')
    const reducer = createAsyncReducer(null, actions)

    test('should be able to handle START action', () => {
      expect(reducer(undefined, actions.start())).toEqual(getStateShape(STARTED))
    })

    test('should be able to handle FLUSH action', () => {
      const state = reducer(undefined, actions.flush('test-payload'))

      expect(isDone(state)).toBeFalsy()
      expect(getPayload(state)).toBe('test-payload')
      expect(getError(state)).toBeFalsy()
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

    test('should be able to handle CANCEL action', () => {
      const state = reducer(undefined, actions.cancel())

      expect(isDone(state)).toBeFalsy()
      expect(getPayload(state)).toBe(null)
      expect(getError(state)).toBe('cancelled')
    })

    test('should be able to handle RESET action with state after START', () => {
      const state = reducer(undefined, actions.start())
      const newState = reducer(state, actions.reset())

      expect(isDone(newState)).toBeFalsy()
      expect(getPayload(newState)).toBe(null)
      expect(getError(newState)).toBeFalsy()
    })

    test('should be able to handle RESET action with state after flush', () => {
      const state = reducer(undefined, actions.flush('test-payload'))
      const newState = reducer(state, actions.reset())

      expect(isDone(newState)).toBeFalsy()
      expect(getPayload(newState)).toBe(null)
      expect(getError(newState)).toBeFalsy()
    })

    test('should be able to handle RESET action with state after DONE', () => {
      const state = reducer(undefined, actions.done('test-payload'))
      const newState = reducer(state, actions.reset())

      expect(isDone(newState)).toBeFalsy()
      expect(getPayload(newState)).toBe(null)
      expect(getError(newState)).toBeFalsy()
    })

    test('should be able to handle RESET action with state after ERROR', () => {
      const state = reducer(undefined, actions.error('error'))
      const newState = reducer(state, actions.reset())

      expect(isDone(newState)).toBeFalsy()
      expect(getPayload(newState)).toBe(null)
      expect(getError(newState)).toBeFalsy()
    })
  })
})
