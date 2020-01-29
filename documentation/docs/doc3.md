---
id: doc3
title: Reacts + Hooks
---

# The new mix


## Create actions
Create your async actions
```javascript
// my-actions.js
import { createAsyncActions } from 'resynchronize'
const getList = createAsyncActions('GEL_LIST')
```
## Dispatch the actions on the right moment
Use your created actions to set the right status on the right moment of your requests

```javascript
// my-reducers.js
import { getList } from './my-actions.js'
// Could be redux, or could be something else as far as you can get the state from it

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
---
## HOOK IT!

### Implement it in your component with useReducer

```javascript
// my-component.js
import React, { useReducer } from 'react-redux'
import { getAsyncProps } from 'resynchronize'
import { myGetList } from './my-actions.js'
import { getListReducer } from './my-reducer.js'

...

const MyList = ({ list, getList }) => {
  const [state, dispatch] = useReducer(getListReducer, initialState)
  const { status, payload, error } = getAsyncProps(state)

  return (
    <div>
      <button onClick={() => myGetList(dispatch)}>Get the list!</button>
      {status.error && <div className='error'>
        Something happened: {error}
      </div>}
      {status.loading && <div className='loading'>
        loading...
      </div>}
      {status.done && <ul className='items'>
        {payload.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>}
    </div>
  )
}


export default connector(MyList)
```