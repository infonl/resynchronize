---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

# The beggining

## Install
Copy and run this in your project folder
```shell
npm i --save resynchronize
```
## Create actions
Create your async actions, the returned object will contain different actions inside that can be used to set the steps of your async functions.
```javascript
// my-actions.js
import { createAsyncActions } from 'resynchronize'
const getList = createAsyncActions('GEL_LIST')
```
## Dispatch the actions on the right moment
Use your created actions to set the right status on the right moment of your requests
### Basic example
```javascript
// my-actions.js
// Could be redux, or could be something else as far as you can get the state from it
import store from './my-store.js'

const myGetList = (dispatch) => {
  dispatch(getList.start()) // Loading starts
  fetch('/api/list')
    .then(data => {
      dispatch(getList.done(data)) // The async action is done
    })
    .catch(ex => {
      dispatch(getList.error(ex)) // The async action failed
    })

}
```
### Other example
Anything that you have to wait for it can be expressed with the async actions
```javascript
// my-actions.js
// Could be redux, or could be something else as far as you can get the state from it
import store from './my-store.js'

const myGetList = (dispatch) => {
  dispatch(getList.start()) // Loading starts
  setTimeOut(() => {
    dispatch(getList.done('the wait is over!')) // The async action is done
  }, 1000)
}
```
---
## Create reducers
All this actions will trigger state changes thru a reducer, you can always use the action object to tackle the different moments yourself, but to simplify it even more you can use the creator function.
```javascript
// my-reducers.js
import { createAsyncReducer } from 'resynchronize'
import { getList } from './my-actions.js'

// Simple implementation
const getListReducer = createAsyncReducer(
  [],
  getList
)
```
Combinable with other actions
```javascript
const getListReducer = createAsyncReducer(
  [],
  { getList }
)
```
Custom reducers for the different parts, we will go there eventually dont worry
```javascript
const getListReducer = createAsyncReducer(
  [],
  {
    [getList]: {
      done: (currentPayload, action) => action.payload || currrentPayload
    }
  }
)
```

## Get payload and check status
With the actions being reduced, the next step is using this async state on your code. You can always use it raw, the shape of the state will be consistent if you use the creators, but again to simplify our logic and controls you can use the getters and be completely sure that no matter what internal changes could happen on the internals, it will be reliable.
### Quick checks
Simple and quick way to obtain the async state, it will contain the status object with all the status on boolean shape, the payload (as you set it on your dispatchs) and the error (same as payload)
```javascript
// my-reducers.js
import { getAsyncProps } from 'resynchronize'
// Could be redux, or could be something else as far as you can get the state from it
import store from './my-store.js'

const state = store.getState()
const list = getAsyncProps(state.list)
/*
list = {
  status: {
    done: false,
    loading: false,
    cancelled: false,
    error: false
  },
  payload: [],
  error: null
}
*/
```
### Individual checks
In case you don't need all the object, just basic checks, you can use the individual getters.
```javascript
// my-reducers.js
import { isDone, isLoading, isCancelled, hasError, getError, getPayload } from 'resynchronize'
// Could be redux, or could be something else as far as you can get the state from it
import store from './my-store.js'

const state = store.getState()
const done = isDone(state.list)
const loading = isLoading(state.list)
const cancelled = isCancelled(state.list)
const someError = hasError(state.list)
const theErrorObject = getError(state.list)
const payload = getPayload(state.list)
```
---
## Connect?
Now, we need to use this to render something right? check the examples
- [Redux + React example](redux-react-example.md)

