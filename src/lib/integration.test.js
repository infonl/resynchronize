/* global test, expect, describe */
import createAsyncActions from './createAsyncActions'
import createAsyncReducer from './createAsyncReducer'
import { isDone, getPayload, getError, isLoading, hasError, isCancelled } from './utils'

const expectDefault = (current, reducer) => {
  test('be able to handle any other action action without triggering changes', () => {
    const state = reducer(current, { type: 'asdasdadsasd' })

    expect(isDone(state)).toBe(isDone(current))
    expect(isLoading(state)).toBe(isLoading(current))
    expect(hasError(state)).toBe(hasError(current))
    expect(isCancelled(state)).toBe(isCancelled(current))
    expect(getPayload(state)).toBe(getPayload(current))
    expect(getError(state)).toBe(getError(current))
  })
}

const expectStart = (current, reducer, actions, actionPayload, payload, error) => {
  test('should be able to handle START action', () => {
    const state = reducer(current, actions.start(actionPayload))

    expect(isDone(state)).toBeFalsy()
    expect(isLoading(state)).toBeTruthy()
    expect(hasError(state)).toBeFalsy()
    expect(isCancelled(state)).toBeFalsy()
    expect(getPayload(state)).toBe(payload)
    expect(getError(state)).toBe(error)
  })
}

const expectFlush = (current, reducer, actions, actionPayload, payload, error) => {
  test('shoud be able to handle FLUSH action', () => {
    const state = reducer(current, actions.flush(actionPayload))

    expect(isDone(state)).toBeFalsy()
    expect(isLoading(state)).toBeTruthy()
    expect(hasError(state)).toBeFalsy()
    expect(isCancelled(state)).toBeFalsy()
    expect(getPayload(state)).toBe(payload)
    expect(getError(state)).toBe(error)
  })
}

const expectDone = (current, reducer, actions, actionPayload, payload, error) => {
  test('should be able to handle DONE action', () => {
    const state = reducer(current, actions.done(actionPayload))

    expect(isLoading(state)).toBeFalsy()
    expect(isDone(state)).toBeTruthy()
    expect(hasError(state)).toBeFalsy()
    expect(getPayload(state)).toBe(payload)
    expect(getError(state)).toBe(error)
  })
}

const expectError = (current, reducer, actions, actionPayload, payload, error) => {
  test('be able to handle ERROR action', () => {
    const state = reducer(current, actions.error(actionPayload))

    expect(isDone(state)).toBeFalsy()
    expect(isLoading(state)).toBeFalsy()
    expect(hasError(state)).toBeTruthy()
    expect(isCancelled(state)).toBeFalsy()
    expect(getPayload(state)).toBe(payload)
    expect(getError(state)).toBe(error)
  })
}

const expectCancel = (current, reducer, actions, actionPayload, payload, error) => {
  test('be able to handle CANCEL action', () => {
    const state = reducer(current, actions.cancel(actionPayload))

    expect(isDone(state)).toBeFalsy()
    expect(isLoading(state)).toBeFalsy()
    expect(hasError(state)).toBeFalsy()
    expect(isCancelled(state)).toBeTruthy()
    expect(getPayload(state)).toBe(payload)
    expect(getError(state)).toBe(error)
  })
}

const expectReset = (current, reducer, actions, actionPayload, payload, error) => {
  test('be able to handle RESET action', () => {
    const state = reducer(current, actions.reset(actionPayload))

    expect(isDone(state)).toBeFalsy()
    expect(isLoading(state)).toBeFalsy()
    expect(hasError(state)).toBeFalsy()
    expect(isCancelled(state)).toBeFalsy()
    expect(getPayload(state)).toBe(payload)
    expect(getError(state)).toBe(error)
  })
}

describe('Integration tests', () => {
  describe('Simpliest configuration', () => {
    const actions = createAsyncActions('LIST')
    const reducer = createAsyncReducer(null, actions)

    describe('without state', () => {
      expectDefault(undefined, reducer)
      expectStart(undefined, reducer, actions, null, null, null)
      expectFlush(undefined, reducer, actions, 'test-flush', 'test-flush', null)
      expectDone(undefined, reducer, actions, 'test-payload', 'test-payload', null)
      expectError(undefined, reducer, actions, 'test-error', null, 'test-error')
      expectCancel(undefined, reducer, actions, 'test-cancelled', null, 'test-cancelled')
      expectReset(undefined, reducer, actions, undefined, null, null)
    })

    describe('with state after start', () => {
      const state = reducer(undefined, actions.start('start-payload'))
      expectDefault(state, reducer)
      expectStart(state, reducer, actions, 'start-payload', 'start-payload', null)
      expectFlush(state, reducer, actions, 'test-flush', 'test-flush', null)
      expectDone(state, reducer, actions, 'test-payload', 'test-payload', null)
      expectError(state, reducer, actions, 'test-error', null, 'test-error')
      expectCancel(state, reducer, actions, 'test-cancelled', null, 'test-cancelled')
      expectReset(state, reducer, actions, undefined, null, null)
    })

    describe('with state after flush', () => {
      const state = reducer(undefined, actions.flush('payload'))
      expectDefault(state, reducer)
      expectStart(state, reducer, actions, 'start-payload', 'start-payload', null)
      expectFlush(state, reducer, actions, 'test-flush', 'test-flush', null)
      expectDone(state, reducer, actions, 'test-payload', 'test-payload', null)
      expectError(state, reducer, actions, 'test-error', null, 'test-error')
      expectCancel(state, reducer, actions, 'test-cancelled', null, 'test-cancelled')
      expectReset(state, reducer, actions, undefined, null, null)
    })

    describe('with state after done', () => {
      const state = reducer(undefined, actions.done('payload'))
      expectDefault(state, reducer)
      expectStart(state, reducer, actions, 'start-payload', 'start-payload', null)
      expectFlush(state, reducer, actions, 'test-flush', 'test-flush', null)
      expectDone(state, reducer, actions, 'test-payload', 'test-payload', null)
      expectError(state, reducer, actions, 'test-error', null, 'test-error')
      expectCancel(state, reducer, actions, 'test-cancelled', null, 'test-cancelled')
      expectReset(state, reducer, actions, undefined, null, null)
    })

    describe('with state after error', () => {
      const state = reducer(undefined, actions.error('payload'))
      expectDefault(state, reducer)
      expectStart(state, reducer, actions, 'start-payload', 'start-payload', null)
      expectFlush(state, reducer, actions, 'test-flush', 'test-flush', null)
      expectDone(state, reducer, actions, 'test-payload', 'test-payload', null)
      expectError(state, reducer, actions, 'test-error', null, 'test-error')
      expectCancel(state, reducer, actions, 'test-cancelled', null, 'test-cancelled')
      expectReset(state, reducer, actions, undefined, null, null)
    })
  })
})
