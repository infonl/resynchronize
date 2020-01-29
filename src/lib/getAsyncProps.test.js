/* global test, expect, describe */
import { STARTED } from './consts'
import { getStateShape } from './utils'
import getAsyncProps, { getAsyncStatus } from './getAsyncProps'

test('getAsyncProps returns an object with 4 basic properties', () => {
  const asyncNode = { status: null, payload: null, error: null }
  const properties = getAsyncProps(asyncNode)
  expect(properties).toHaveProperty('payload')
  expect(properties).toHaveProperty('status')
  expect(properties).toHaveProperty('error')
})

test('getAsyncStatus returns an object with 4 basic properties', () => {
  const asyncNode = { status: null, payload: null, error: null }
  const properties = getAsyncStatus(asyncNode)

  expect(properties).toHaveProperty('loading')
  expect(properties).toHaveProperty('done')
  expect(properties).toHaveProperty('cancel')
  expect(properties).toHaveProperty('error')
})

describe('getAsyncStatus ', () => {
  describe('initial state', () => {
    const asyncNode = { status: null, payload: null, error: null }
    const properties = getAsyncStatus(asyncNode)

    test('done is false', () => {
      expect(properties.done).toBeFalsy()
    })

    test('loading is false', () => {
      expect(properties.loading).toBeFalsy()
    })

    test('error is null', () => {
      expect(properties.error).toBeFalsy()
    })
  })

  describe('started state', () => {
    const asyncNode = getStateShape(STARTED)
    const properties = getAsyncStatus(asyncNode)

    test('done is false', () => {
      expect(properties.done).toBeFalsy()
    })

    test('loading is true', () => {
      expect(properties.loading).toBeTruthy()
    })

    test('error is null', () => {
      expect(properties.error).toBeFalsy()
    })
  })

  describe('done state', () => {
    const asyncNode = { status: 'DONE', payload: 'hello world!', error: null }
    const properties = getAsyncStatus(asyncNode)

    test('done is true', () => {
      expect(properties.done).toBeTruthy()
    })

    test('loading is false', () => {
      expect(properties.loading).toBeFalsy()
    })

    test('error is null', () => {
      expect(properties.error).toBeFalsy()
    })
  })

  describe('error state', () => {
    const asyncNode = { status: 'ERROR', payload: 'hello world!', error: 'Some error!' }
    const properties = getAsyncStatus(asyncNode)

    test('done is false', () => {
      expect(properties.done).toBeFalsy()
    })

    test('loading is false', () => {
      expect(properties.loading).toBeFalsy()
    })

    test('error contains the error', () => {
      expect(properties.error).toBeTruthy()
    })
  })
})

describe('getAsyncProps ', () => {
  describe('initial state', () => {
    const asyncNode = { status: null, payload: null, error: null }
    const properties = getAsyncProps(asyncNode)

    test('payload contains the payload', () => {
      expect(properties.payload).toBe(asyncNode.payload)
    })

    test('error is null', () => {
      expect(properties.error).toBeFalsy()
    })
  })

  describe('started state', () => {
    const asyncNode = getStateShape(STARTED)
    const properties = getAsyncProps(asyncNode)

    test('payload contains the payload', () => {
      expect(properties.payload).toBe(asyncNode.payload)
    })

    test('error is null', () => {
      expect(properties.error).toBeFalsy()
    })
  })

  describe('done state', () => {
    const asyncNode = { status: 'DONE', payload: 'hello world!', error: null }
    const properties = getAsyncProps(asyncNode)

    test('payload contains the payload', () => {
      expect(properties.payload).toBe(asyncNode.payload)
    })

    test('error is null', () => {
      expect(properties.error).toBeFalsy()
    })
  })

  describe('error state', () => {
    const asyncNode = { status: 'ERROR', payload: 'hello world!', error: 'Some error!' }
    const properties = getAsyncProps(asyncNode)

    test('payload contains the payload', () => {
      expect(properties.payload).toBe(asyncNode.payload)
    })

    test('error contains the error', () => {
      expect(properties.error).toBe(asyncNode.error)
    })
  })
})
