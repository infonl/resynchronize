---
id: doc2
title: Redux + React
---
# The classic mix

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

const myGetList = (dispatch) => { // or () => dispatch => {} if you are using thunks
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
## CONNECT!

### Create The store
Follow this [guide](https://redux-toolkit.js.org/api/configureStore)
and then add your reducers line any other reducer:

```javascript
// my-store.js
import { getListReducer } from './my-reducer.js'
...
const store = configureStore({
  reducer: {
    list: getListReducer
  },
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
  enhancers: [reduxBatch]
})
```

### Let's create put some components on the mix
Follow this [guide](https://react-redux.js.org/introduction/basic-tutorial#providing-the-store) to provide the store to your components, and then lets jump into hooking the components with connect following [this other guide](https://react-redux.js.org/introduction/basic-tutorial#connecting-the-components).

Now that we have all the ingredients lets see how a map would look when we add the getter functions on the mix:
```javascript
// my-component.js
import { connect } from 'react-redux'
import { getAsyncProps } from 'resynchronize'
import { myGetList } from './my-actions.js'
...

const connector = connect(
  (state) => {
    list: getAsyncProps(state.list)
  },
  (dispatch) => {
    getList: () => myGetList(dispatch) // or dispach(myGetList) with thunks
  }
)
```

Lets see how to ensamble a basic loading mechanism:

```javascript
// my-component.js
...

const MyList = ({ list, getList }) => {
  const { status, payload, error } = list
  return (
    <div>
      <button onClick={getList}>Get the list!</button>
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
