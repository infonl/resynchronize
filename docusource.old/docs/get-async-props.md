---
id: get-async-props
title: getAsyncProps
---

# Getting your async state on an simple shape

## Syntax

> getAsyncProps(*stateObject*)

## Parameters

### stateObject
- *Object* Async state object

## Returns
*Object* An object with the properties:
 - `status`: *Object§* object with the different possible status on boolean shape:
    - `loading`: *Boolean* loading indication
    - `done`: *Boolean* Finished process indication
    - `cancel`: *Boolean* Cancelled process indication
    - `error`: *Boolean* Error state indication
 - `payload`: *Any* Payload of the async process
 - `error`: *Any* Error of the async process

## Usage
For more information on how to use this function please refer to the [Advance usage](custom-reducers)

