/* global test, expect, describe */
import createAsyncActions, { isAsyncActions, getAsyncKeys } from './createAsyncActions'

describe('isAsyncActions', () => {
  const keys = getAsyncKeys('TEST')

  test('returns an object with 3 actions', () => {
    expect(keys).toHaveProperty('start')
    expect(keys).toHaveProperty('progress')
    expect(keys).toHaveProperty('done')
    expect(keys).toHaveProperty('error')
    expect(keys).toHaveProperty('cancel')
    expect(keys).toHaveProperty('reset')
  })
})

describe('createAsyncActions', () => {
  const actions = createAsyncActions('TEST')

  test('returns an object with 3 actions', () => {
    expect(actions).toHaveProperty('start')
    expect(actions).toHaveProperty('progress')
    expect(actions).toHaveProperty('done')
    expect(actions).toHaveProperty('error')
    expect(actions).toHaveProperty('cancel')
    expect(actions).toHaveProperty('reset')
  })

  test('stringified returns the type', () => {
    expect(`${actions}`).toBe('TEST')
  })

  test('properties stringified return the concatenation', () => {
    expect(`${actions.start}`).toBe('START_TEST')
    expect(`${actions.progress}`).toBe('PROGRESS_TEST')
    expect(`${actions.done}`).toBe('DONE_TEST')
    expect(`${actions.error}`).toBe('ERROR_TEST')
    expect(`${actions.cancel}`).toBe('CANCEL_TEST')
    expect(`${actions.reset}`).toBe('RESET_TEST')
  })

  test('properties type return the concatenation too', () => {
    expect(actions.start.type).toBe('START_TEST')
    expect(actions.progress.type).toBe('PROGRESS_TEST')
    expect(actions.done.type).toBe('DONE_TEST')
    expect(actions.error.type).toBe('ERROR_TEST')
    expect(actions.cancel.type).toBe('CANCEL_TEST')
    expect(actions.reset.type).toBe('RESET_TEST')
  })
})

describe('isAsyncActions', () => {
  test('type check is correct if is used with an async action', () => {
    const actions = createAsyncActions('TEST')
    expect(isAsyncActions(actions)).toBeTruthy()
  })

  test('type check is incorrect if is used without an async action', () => {
    expect(isAsyncActions({ start: null })).toBeFalsy()
  })
})
