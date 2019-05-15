/* global test, expect */
import { createAsyncActions } from '.'

test('createAsyncActions returns an object with 3 actions', () => {
  const actions = createAsyncActions('TEST')
  expect(actions).toHaveProperty('START')
  expect(actions).toHaveProperty('DONE')
  expect(actions).toHaveProperty('ERROR')
  expect(actions).toHaveProperty('RESET')
})
