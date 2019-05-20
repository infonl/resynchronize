/* global test, expect */
const getGetterAsyncProps = require('./getGetterAsyncProps')

test('getGetterAsyncProps returns the properties located on the getter prop with an object with 4 basic properties for each one', () => {
  const asyncNode = { status: null, payload: null, error: null }
  const state = {
    asyncProp: asyncNode
  }
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
