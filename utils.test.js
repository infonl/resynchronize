/* global test, expect, describe */
const utils = require('./utils')

describe('createAction', () => {
  const action = utils.createAction('TEST')

  test('can be stringified to its type', () => {
    expect(`${action}`).toBe('TEST')
    expect(`${action.type}`).toBe('TEST')
  })

  test('when called returns an object with type and payload', () => {
    const dispatchable = action()
    expect(dispatchable).toHaveProperty('type')
    expect(dispatchable.type).toBe('TEST')
    expect(dispatchable.payload).toBe(null)
  })

  test('when called with an argument returns an object with type and the argument as payload', () => {
    const dispatchable = action('something')
    expect(dispatchable).toHaveProperty('type')
    expect(dispatchable.type).toBe('TEST')
    expect(dispatchable.payload).toBe('something')
  })
})

describe('initial state', () => {
  const asyncNode = { status: null, payload: null, error: null }

  test('isDone returns false', () => {
    expect(utils.isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns false', () => {
    expect(utils.isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns null', () => {
    expect(utils.getPayload(asyncNode)).toBeFalsy()
  })

  test('getError returns false', () => {
    expect(utils.getError(asyncNode)).toBeFalsy()
  })
})

describe('started state', () => {
  const asyncNode = { status: 'START', payload: null, error: null }

  test('isDone returns false', () => {
    expect(utils.isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns true', () => {
    expect(utils.isLoading(asyncNode)).toBeTruthy()
  })

  test('getPayload returns null', () => {
    expect(utils.getPayload(asyncNode)).toBeFalsy()
  })

  test('getError returns false', () => {
    expect(utils.getError(asyncNode)).toBeFalsy()
  })
})

describe('done state', () => {
  const asyncNode = { status: 'DONE', payload: 'hello world!', error: null }

  test('isDone returns true', () => {
    expect(utils.isDone(asyncNode)).toBeTruthy()
  })

  test('isLoading returns false', () => {
    expect(utils.isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns the payload', () => {
    expect(utils.getPayload(asyncNode)).toBe(asyncNode.payload)
  })

  test('getError returns false', () => {
    expect(utils.getError(asyncNode)).toBeFalsy()
  })
})

describe('error state', () => {
  const asyncNode = { status: 'ERROR', payload: 'hello world!', error: 'Some error!' }

  test('isDone returns false', () => {
    expect(utils.isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns true', () => {
    expect(utils.isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns the payload', () => {
    expect(utils.getPayload(asyncNode)).toBe(asyncNode.payload)
  })

  test('error returns the error', () => {
    expect(utils.getError(asyncNode)).toBe(asyncNode.error)
  })
})
