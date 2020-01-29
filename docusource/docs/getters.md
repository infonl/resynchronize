---
id: getters
title: Getters
---

# Getting your async state on simple values
all this functions use the async state as **first and only argument**

## isDone
Checks if the async state is done
> isDone(*stateObject*)

returns *Boolean*
## isLoading
Checks if the async state is loading
> isLoading(*stateObject*)

returns *Boolean*
## isCancelled
Checks if the async state is cancelled
> isCancelled(*stateObject*)

returns *Boolean*
## hasError
Checks if the async state is on error state
> hasError(*stateObject*)

returns *Boolean*
## getError
Gets the current error
> getError(*stateObject*)

returns *any*
## getPayload
Gets the current payload
> getPayload(*stateObject*)

returns *any*

