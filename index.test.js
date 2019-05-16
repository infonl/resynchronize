/* global test, expect */
const resynchronize = require('.')

test('createAsyncActions returns an object with 3 actions', () => {
  const actions = resynchronize.createAsyncActions('TEST')
  expect(actions).toHaveProperty('START')
  expect(actions).toHaveProperty('DONE')
  expect(actions).toHaveProperty('ERROR')
  expect(actions).toHaveProperty('RESET')
})
