---
id: create-actions
title: createAsyncActions
---

# Creating actions for your async states

## Syntax

> createAsyncActions(*actionType*)

## Parameters

### ActionType
- *String* Identificator of the actions, it will be used as a prefix for all the actions inside de object

## Returns
*Object* Object with all the async actions available, its `toString` method is overwrited to return the `actionType`
 - `start`: Indicates the start of the requests/process
 - `progress`: Allows to push to the payload/error without completing the process
 - `done`: Completes the process
 - `error`: Completes the process with error
 - `cancel`: Cancel the process
 - `reset`: Reset the process

## Example
```javascript
// my-actions.js
import { createAsyncActions } from 'resynchronize'
const getList = createAsyncActions('GEL_LIST')

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
