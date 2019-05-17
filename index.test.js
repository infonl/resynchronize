/* global test, expect, describe */
const resynchronize = require('.')

describe('createAsyncActions', () => {
  const actions = resynchronize.createAsyncActions('TEST')

  test('returns an object with 3 actions', () => {
    expect(actions).toHaveProperty('START')
    expect(actions).toHaveProperty('DONE')
    expect(actions).toHaveProperty('ERROR')
    expect(actions).toHaveProperty('RESET')
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

test('getAsyncProperties returns an object with 4 basic properties', () => {
  const asyncNode = { status: null, payload: null, error: null }
  const properties = resynchronize.getAsyncProperties(asyncNode)
  expect(properties).toHaveProperty('payload')
  expect(properties).toHaveProperty('loading')
  expect(properties).toHaveProperty('done')
  expect(properties).toHaveProperty('error')
})

test('createAsyncReducerConfig returns a collection of actions', () => {
  const actions = resynchronize.createAsyncActions('TEST')
  const reducerConfig = resynchronize.createAsyncReducerConfig(actions)

  expect(reducerConfig).toHaveProperty('START_TEST')
  expect(reducerConfig).toHaveProperty('DONE_TEST')
  expect(reducerConfig).toHaveProperty('ERROR_TEST')
  expect(reducerConfig).toHaveProperty('RESET_TEST')
})

test('createAsyncReducerConfig returns a sumarized collection of actions', () => {
  const actions = resynchronize.createAsyncActions('TEST')
  const actions2 = resynchronize.createAsyncActions('TEST2')
  const reducerConfig = resynchronize.createAsyncReducerConfig({
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
