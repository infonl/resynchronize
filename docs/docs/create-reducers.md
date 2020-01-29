---
id: create-reducers
title: createAsyncReducer
---

# Reducing your async actions

## Syntax

> createAsyncReducer(*initialPayload*, *payloadHandlers*, *errorHandlers*)

## Parameters

### initialPayload
- *Any* Initial value for your async state
### payloadHandlers
- *AsyncAction* Object returned from an async action creator
```javascript {6}
const getList = createAsyncActions('GEL_LIST')

// Simple implementation
const getListReducer = createAsyncReducer(
  [],
  getList
)
```
- *Object* Composed of `AscynActions`
```javascript {3}
const getListReducer = createAsyncReducer(
  [],
  { getList }
)
```
- *Object* Composed with `AsyncAction` types, or the equivalenr to an `AsyncAction` `actionType`
```javascript {3,4,5,6,7}
const getListReducer = createAsyncReducer(
  [],
  {
    [getList]: {
      done: (currentPayload, action) => action.payload || currrentPayload
    }
  }
)
```
### errorHandlers
- *AsyncAction* Object returned from an async action creator
```javascript {7}
const getList = createAsyncActions('GEL_LIST')

// Simple implementation
const getListReducer = createAsyncReducer(
  [],
  getList,
  getList,
)
```
- *Object* Composed of `AscynActions`
```javascript {4}
const getListReducer = createAsyncReducer(
  [],
  { getList },
  { getList }
)
```
- *Object* Composed with `AsyncAction` types, or the equivalenr to an `AsyncAction` `actionType`
```javascript {8,9,10,11,12}
const getListReducer = createAsyncReducer(
  [],
  {
    [getList]: {
      done: (currentPayload, action) => action.payload || currrentPayload
    }
  },
  {
    [getList]: {
      done: (currentPayload, action) => action.payload || currrentPayload
    }
  }
)
```

## Returns
*Function* A simple reducer that will follow the configurations stablished by the handlers.
Signature:
 - `state`: Current async state
 - `action`: Store action

## Usage
For more information on how to use this function please refer to the [Advance usage](custom-reducers)

