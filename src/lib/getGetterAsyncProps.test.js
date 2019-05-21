/* global describe, test, expect */
const getGetterAsyncProps = require('./getGetterAsyncProps')

describe('getAsyncKeys', () => {
  const asyncNode = { status: null, payload: null, error: null }
  const state = {
    asyncProp: asyncNode
  }

  test('returns the properties located on the getter prop with an object with 4 basic properties for each one', () => {
    const componentProps = {
      getter: {
        asyncProp: (state) => state.asyncProp
      }
    }
    const properties = getGetterAsyncProps.default(state, componentProps)
    expect(properties).toHaveProperty('asyncProp')
    expect(properties.asyncProp).toHaveProperty('payload')
    expect(properties.asyncProp).toHaveProperty('loading')
    expect(properties.asyncProp).toHaveProperty('done')
    expect(properties.asyncProp).toHaveProperty('error')
  })

  test('returns the properties located on the getter prop fused with the previously found on the component props', () => {
    const componentProps = {
      getter: {
        asyncProp: (state) => state.asyncProp
      },
      asyncProp: 'something-else'
    }
    const properties = getGetterAsyncProps.default(state, componentProps)
    expect(properties).toHaveProperty('asyncProp')
    expect(properties.asyncProp).toHaveProperty('own')
    expect(properties.asyncProp).toHaveProperty('connected')
    expect(properties.asyncProp.own).toBe('something-else')
    expect(properties.asyncProp.connected).toHaveProperty('payload')
    expect(properties.asyncProp.connected).toHaveProperty('loading')
    expect(properties.asyncProp.connected).toHaveProperty('done')
    expect(properties.asyncProp.connected).toHaveProperty('error')
  })
})

describe('getAsyncKeys', () => {
  test('should return keys of getter object', () => {
    const getter = {
      asyncProp1: () => {},
      asyncProp2: () => {}
    }

    const keys = getGetterAsyncProps.getAsyncKeys(getter)
    expect(keys).toEqual(['asyncProp1', 'asyncProp2'])
  })
  test('should return empty list of keys if getter object empty', () => {
    const keys = getGetterAsyncProps.getAsyncKeys({})
    expect(keys).toEqual([])
  })
  test('should return default list of keys if getter is null', () => {
    const keys = getGetterAsyncProps.getAsyncKeys(null)
    expect(keys).toEqual(['asyncProp'])
  })

  test('should return default list of keys if getter is undefined', () => {
    const keys = getGetterAsyncProps.getAsyncKeys()
    expect(keys).toEqual(['asyncProp'])
  })
})
