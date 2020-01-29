/* global test, expect, describe */
const getAsyncProps = require('./getAsyncProps')

test('getAsyncProps returns an object with 4 basic properties', () => {
  const asyncNode = { status: null, payload: null, error: null }
  const properties = getAsyncProps.default(asyncNode)
  expect(properties).toHaveProperty('payload')
  expect(properties).toHaveProperty('loading')
  expect(properties).toHaveProperty('done')
  expect(properties).toHaveProperty('error')
})

describe('getAsyncProps ', () => {
  describe('initial state', () => {
    const asyncNode = { status: null, payload: null, error: null }
    const properties = getAsyncProps.default(asyncNode)

    test('done is dalse', () => {
      expect(properties.done).toBeFalsy()
    })

    test('loading is false', () => {
      expect(properties.loading).toBeFalsy()
    })

    test('payload contains the payload', () => {
      expect(properties.payload).toBe(asyncNode.payload)
    })

    test('error is null', () => {
      expect(properties.error).toBeFalsy()
    })
  })

  describe('started state', () => {
    const asyncNode = { status: 'STARTED', payload: null, error: null }
    const properties = getAsyncProps.default(asyncNode)

    test('done is dalse', () => {
      expect(properties.done).toBeFalsy()
    })

    test('loading is true', () => {
      expect(properties.loading).toBeTruthy()
    })

    test('payload contains the payload', () => {
      expect(properties.payload).toBe(asyncNode.payload)
    })

    test('error is null', () => {
      expect(properties.error).toBeFalsy()
    })
  })

  describe('done state', () => {
    const asyncNode = { status: 'DONE', payload: 'hello world!', error: null }
    const properties = getAsyncProps.default(asyncNode)

    test('done is true', () => {
      expect(properties.done).toBeTruthy()
    })

    test('loading is false', () => {
      expect(properties.loading).toBeFalsy()
    })

    test('payload contains the payload', () => {
      expect(properties.payload).toBe(asyncNode.payload)
    })

    test('error is null', () => {
      expect(properties.error).toBeFalsy()
    })
  })

  describe('error state', () => {
    const asyncNode = { status: 'ERROR', payload: 'hello world!', error: 'Some error!' }
    const properties = getAsyncProps.default(asyncNode)

    test('done is false', () => {
      expect(properties.done).toBeFalsy()
    })

    test('loading is true', () => {
      expect(properties.loading).toBeFalsy()
    })

    test('payload contains the payload', () => {
      expect(properties.payload).toBe(asyncNode.payload)
    })

    test('error contains the error', () => {
      expect(properties.error).toBe(asyncNode.error)
    })
  })
})
