/* global test, expect, describe */
const resynchronize = require('.')

test('createAsyncActions returns an object with 3 actions', () => {
  const actions = resynchronize.createAsyncActions('TEST')
  expect(actions).toHaveProperty('START')
  expect(actions).toHaveProperty('DONE')
  expect(actions).toHaveProperty('ERROR')
  expect(actions).toHaveProperty('RESET')
})

test('getAsyncProperties returns an object with 4 basic properties', () => {
  const asyncNode = { status: null, payload: null, error: null }
  const properties = resynchronize.getAsyncProperties(asyncNode)
  expect(properties).toHaveProperty('payload')
  expect(properties).toHaveProperty('loading')
  expect(properties).toHaveProperty('done')
  expect(properties).toHaveProperty('error')
})

describe('initial state', () => {
  const asyncNode = { status: null, payload: null, error: null }

  test('isDone returns false', () => {
    expect(resynchronize.isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns false', () => {
    expect(resynchronize.isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns null', () => {
    expect(resynchronize.getPayload(asyncNode)).toBeFalsy()
  })

  test('getError returns false', () => {
    expect(resynchronize.getError(asyncNode)).toBeFalsy()
  })

  describe('getAsyncProperties ', () => {
    const properties = resynchronize.getAsyncProperties(asyncNode)

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
})

describe('started state', () => {
  const asyncNode = { status: 'START', payload: null, error: null }

  test('isDone returns false', () => {
    expect(resynchronize.isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns true', () => {
    expect(resynchronize.isLoading(asyncNode)).toBeTruthy()
  })

  test('getPayload returns null', () => {
    expect(resynchronize.getPayload(asyncNode)).toBeFalsy()
  })

  test('getError returns false', () => {
    expect(resynchronize.getError(asyncNode)).toBeFalsy()
  })

  describe('getAsyncProperties ', () => {
    const properties = resynchronize.getAsyncProperties(asyncNode)

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
})

describe('done state', () => {
  const asyncNode = { status: 'DONE', payload: 'hello world!', error: null }

  test('isDone returns true', () => {
    expect(resynchronize.isDone(asyncNode)).toBeTruthy()
  })

  test('isLoading returns false', () => {
    expect(resynchronize.isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns the payload', () => {
    expect(resynchronize.getPayload(asyncNode)).toBe(asyncNode.payload)
  })

  test('getError returns false', () => {
    expect(resynchronize.getError(asyncNode)).toBeFalsy()
  })

  describe('getAsyncProperties ', () => {
    const properties = resynchronize.getAsyncProperties(asyncNode)

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
})

describe('error state', () => {
  const asyncNode = { status: 'ERROR', payload: 'hello world!', error: 'Some error!' }

  test('isDone returns false', () => {
    expect(resynchronize.isDone(asyncNode)).toBeFalsy()
  })

  test('isLoading returns true', () => {
    expect(resynchronize.isLoading(asyncNode)).toBeFalsy()
  })

  test('getPayload returns the payload', () => {
    expect(resynchronize.getPayload(asyncNode)).toBe(asyncNode.payload)
  })

  test('error returns the error', () => {
    expect(resynchronize.getError(asyncNode)).toBe(asyncNode.error)
  })

  describe('getAsyncProperties ', () => {
    const properties = resynchronize.getAsyncProperties(asyncNode)

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
