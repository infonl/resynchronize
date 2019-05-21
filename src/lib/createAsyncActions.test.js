/* global test, expect, describe */
const createAsyncActions = require('./createAsyncActions')

describe('createAsyncActions', () => {
  const actions = createAsyncActions.default('TEST')

  test('returns an object with 3 actions', () => {
    expect(actions).toHaveProperty('START')
    expect(actions).toHaveProperty('DONE')
    expect(actions).toHaveProperty('ERROR')
    expect(actions).toHaveProperty('RESET')
  })

  test('stringified returns the type', () => {
    expect(`${actions}`).toBe('TEST')
  })

  test('properties stringified return the concatenation', () => {
    expect(`${actions.START}`).toBe('START_TEST')
    expect(`${actions.DONE}`).toBe('DONE_TEST')
    expect(`${actions.ERROR}`).toBe('ERROR_TEST')
    expect(`${actions.RESET}`).toBe('RESET_TEST')
  })

  test('properties type return the concatenation too', () => {
    expect(actions.START.type).toBe('START_TEST')
    expect(actions.DONE.type).toBe('DONE_TEST')
    expect(actions.ERROR.type).toBe('ERROR_TEST')
    expect(actions.RESET.type).toBe('RESET_TEST')
  })
})
