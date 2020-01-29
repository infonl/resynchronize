---
id: custom-reducers
title: Custom reducers
---

# When you want to manage your payloads and errors

## Reduce the payload
In case you want to generalize the async promise `done` dispatch or you simply want to parse your results, the toolbox provides a way to alter the payload before it enters the state. To exemplify:

```javascript {7}
const getList = createAsyncActions('GEL_LIST')

const getListReducer = createAsyncReducer(
  [],
  {
    [getList]: {
      done: (currentPayload, action) => action.payload || currrentPayload
    }
  }
)
```

The second argument of the creator can be an *object containing* the keys of your actions and *inside another object* with the properties `start`, `progress`, `done`, `error`, `cancel` and/or `reset`. Every one of this key corresponds with the different triggers of your actions.

When you trigger `getList.done('my-paylaod')` on this example, your method on the `done` property will receive the current payload on your state and an action with the payload `'my-payload'`. From there you can make any changes to it and return the value you want in your payload.

Of course you can manage how the payload works and its reduced in every other actions and combine them.

```javascript {6}
const getListReducer = createAsyncReducer(
  [],
  {
    [getList]: {
      done: (currentPayload, action) => action.payload || currrentPayload
      error: (currentPayload, action) => currrentPayload
    }
  }
)
```

In this example the payload won't be nullified on error case (the default is nullify on error case). It's very important to notice that the payload in the action is always the one dispatched, in other words, **all the actions share the action payload, the difference is on the reducers**. On the error default case the reducer puts the payload on `null` no mather the value of the payload, because is normally an error, but on done, the error is the nullified one by default. **It's up to the developer to decide any behaviour outside the default one**.

Now if all this customization needs to be applied to multiple async actions the only change needed is adding the key to the first config object:

```javascript {10,11,12}
const getList = createAsyncActions('GEL_LIST')
const getComplexList = createAsyncActions('GEL_COMPLEX_LIST')

const getListReducer = createAsyncReducer(
  [],
  {
    [getList]: {
      done: (currentPayload, action) => action.payload || currrentPayload
    },
    [getComplexList]: {
      done: (currentPayload, action) => action.payload.map(i => i.name) || currrentPayload
    }
  }
)
```

Of course this two actions (both need to be async actions) could be dispatched on different moments and from different places but they will end on the same piece of state.

## Reduce errors
The same scenarios that apply to the payload could also apply to the error, and again the toolbox provides a way to customize how your paylaods land there.

```javascript {10,11,12,13,14}
const getList = createAsyncActions('GEL_LIST')

const getListReducer = createAsyncReducer(
  [],
  { // Payload reducers
    [getList]: {
      done: (currentPayload, action) => action.payload || currrentPayload
    }
  },
  { // Error reducers
    [getList]: {
      done: (currentPayload, action) => action.payload || currrentPayload
    }
  }
)
```

The same rules that apply to the `payload` config apply to the `error` one, the only difference is where this payload ends. If on the payload reducers the content ended on the `payload` section of the state, the error reducer sends it to the `error` section.

Again all the actions share the action paylod but normally they dont apply because the default reducer for actions that are not of the error type (like `error` and `cancel`), reduce the error state to `null`. This means that both `payload` and `error` are **reduced at the same time for all actions**.