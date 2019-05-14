import _ from 'lodash'
import { createAction, handleActions } from 'redux-actions'
import { connect } from 'react-redux'

import fetch from 'isomorphic-fetch'
import React, { Component, Fragment } from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'
import { ssoInstance } from '../utils/authentication'

/**
 * Fuses in one property the given argument properties
 * @param {any} previous previous property
 * @param {any} connected connected property
 */
const fuseProps = (own, connected) => {
  let newProp = connected

  if (typeof own !== 'undefined') {
    newProp = {
      own,
      connected
    }
  }

  return newProp
}

const getAsyncKeys = getter => {
  let asyncProps = ['asyncProp']

  if (typeof getter === 'object') {
    asyncProps = Object.keys(getter).map(key => key)
  }

  return asyncProps
}

// Basic set of functions to manage the state of async actions and reducers
export const isDone = asyncStatus => _.get(asyncStatus, 'status', null) === 'DONE'
export const hasError = asyncStatus => _.get(asyncStatus, 'status', null) === 'ERROR'
export const isLoading = asyncStatus => _.get(asyncStatus, 'status', null) === 'START'
export const getPayload = asyncStatus => _.get(asyncStatus, 'payload', null)

/**
 * Gets the async state properties for connection
 * @param {object} asyncProp Async state property
 */
export const getAsyncProperties = (asyncProp) => ({
  payoad: getPayload(asyncProp),
  loading: isLoading(asyncProp),
  done: isDone(asyncProp),
  error: hasError(asyncProp)
})

export const getGetterAsyncProps = (state, props) => {
  const { getter } = props

  let newAsyncProps = {}

  getAsyncKeys(getter).forEach(key => {
    const newProp = getAsyncProperties(
      getter[key](state)
    )
    newAsyncProps[key] = fuseProps(props[key], newProp)
  })

  return newAsyncProps
}

export const applyAuth = url => {
  return url
}

/**
 * Create a set of basic async actions
 * @param {string} storePath unique identifier for the store
 */
export const createAsyncActions = storePath => ({
  START: createAction(`START_${storePath}`),
  DONE: createAction(`DONE_${storePath}`),
  ERROR: createAction(`ERROR_${storePath}`),
  RESET: createAction(`RESET_${storePath}`)
})
const config = {
  productUrl: '',
  serverPort: '',
  port: '',
  serverProtocol: '',
  protocol: '',
  serverUrl: '',
  url: ''
}

/**
 * Builds the API URL using the given path
 * @param {string} path API path
 * @return {string} API URL
 */
export const getProductURL = (path) => {
  if (path.length && path[0] === '/') path = path.slice(1, path.length)
  return `${config.productUrl}/${path}`
}

// Helper function for fetch responses
export const getResponseStatus = response => {
  const notFound = response.statusText === 'Not Found' || response.status === 404
  const unauthorized = response.statusText === 'Unauthorized' || response.status === 403
  const statusOK = response.statusText === 'OK' || response.status === 200
  const noContent = response.statusText === 'No Content' || response.status === 204
  const responseOk = response.ok

  return {
    unauthorized,
    noContent,
    notFound,
    statusOK,
    responseOk
  }
}

export const getResponsePayload = (response) => {
  let responsePayload = Promise.resolve(null)
  try {
    if (response.json) {
      responsePayload = response.json()
        .catch(ex => null)
    }
  } catch (ex) {
    responsePayload = Promise.resolve(null)
  }
  return responsePayload
}

/**
 * Dispatches a general error
 * @param {object} asyncActions set of async actions
 * @param {object} response fetch response
 * @param {object} errorObject error object either parsed or from a js exception
 */
const dispatchError = (
  asyncActions,
  response = {},
  errorObject = {}
) => dispatch => {
  const message = _.get(errorObject, 'message', 'Error')
  const code = _.get(errorObject, 'code', 'unknown')
  const status = _.get(response, 'status', 'unknown')

  const ex = new Error(message)
  ex.code = code
  ex.status = status

  dispatch(asyncActions.ERROR(errorObject))

  return Promise.reject(ex)
}

/**
 * Call a async fetch
 * @param {String} urlPath Path of the api to be appended, the base path its built using the env parameters plus the "/api" path
 * @param {Object} options Request options
 */
export const makeAsyncCall = (
  urlPath,
  options = {}
) => {
  const { headers, ..._options } = options
  const token = ssoInstance.getAccessToken()
  const fetchOptions = {
    method: 'GET',
    headers: {
      ...headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      authorization: token || ''
    },
    credentials: 'include',
    ..._options
  }

  // Fetch data
  return fetch(
    urlPath,
    fetchOptions
  )
}

/**
 * Create a async fetch dispatchable function using a set of async actions
 * @param {Object} asyncActions Store actions created with "createAsyncActions" method
 * @param {String} urlPath Request URL
 * @param {Object} options Request options
 * @return {Promise} response promise
 */
export const createAsyncDispatchable = (
  asyncActions,
  urlPath,
  options
) => {
  return dispatch => {
    let response = Promise.resolve()
    try {
      // Dispatch START action
      dispatch(asyncActions.START())

      response = makeAsyncCall(urlPath, options) // Get response
        .then(response =>
          getResponsePayload(response) // Get data
            .then((responsePayload) => {
              const { responseOk } = getResponseStatus(response)
              if (responseOk) {
                // Dispatch DONE action
                dispatch(asyncActions.DONE(responsePayload))
                return responsePayload
              } else {
                return dispatch(dispatchError(asyncActions, response, responsePayload))
              }
            })
        )
        .catch(ex => {
          return dispatch(dispatchError(asyncActions, response, ex))
        })
    } catch (ex) {
      // Dispatch error
      response = dispatch(dispatchError(asyncActions, response, ex))
    }
    return response
  }
}

const ASYNC_INITIAL_STATE = { status: null, payload: null, error: null }

export const defaultReducer = (state, { payload }) => payload || state || null

/**
 * Handlers for async actions
 * The reducer is used on the afected property to avoid structure changes on how the library behaves
 * Status is managed by the library and cannot be altered, but the payloads can be updated using custom
 * reducers
 */
const handleStart = reducer => (state, action) => ({
  status: 'START',
  payload: reducer(state.payload, action),
  error: null
})

const handleDone = reducer => (state, action) => ({
  status: 'DONE',
  payload: reducer(state.payload, action),
  error: null
})

const handleError = reducer => (state, action) => ({
  status: 'ERROR',
  payload: state.payload,
  error: reducer(state.error, action)
})

const handleReset = reducer => (state, action) => ({
  status: null,
  payload: reducer(state.payload, action),
  error: null
})

/**
 * Basic action handler creator for async actions
 * @param {object} actions Async actions
 */
const createActionsHandler = (
  actions,
  { start, done, reset, error } = {}
) => ({
  [actions.START]: handleStart(start || defaultReducer),
  [actions.DONE]: handleDone(done || defaultReducer),
  [actions.ERROR]: handleError(error || defaultReducer),
  [actions.RESET]: handleReset(reset || defaultReducer)
})

/**
 * Create a reducer to handle async actions
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 */
export const createAsyncReducer = (asyncActions, asyncHandlers) => {
  let config = {}
  // If is an array of async actions all of them are put into the main reducer
  if (Array.isArray(asyncActions)) {
    asyncActions.forEach(actions => {
      config = {
        ...config,
        ...createActionsHandler(actions, asyncHandlers)
      }
    })
  } else {
    config = createActionsHandler(asyncActions, asyncHandlers)
  }

  return handleActions(config, ASYNC_INITIAL_STATE)
}

/**
 * General connector for async properties
 *
 * Given a `getter` function, sends to the connected component the async properties:
 * `loading`, `done`, `error` and `payload`
 *
 * If the `getter` function its an object with every getter needed on its keys,
 * the keys will be used to send to each property the value of each getter on the object
 * example:
 *  `{ list: state => state.list, mode: state => state.mode }`
 * will/could return:
 *  `loading = { list: true, mode: false }`
 *  `done = { list: false, mode: true' }`
 *  `error = { list: null, mode: null }`
 *  `payload = { list: null, mode: 'default' }`
 *
 * In the case of having the mentioned properties on the component they will be `fused` with the new ones
 * giving an object with both properties on it
 * example:
 * `{ loading: false, done: true, error: null, payload: [] } = ownProps`
 * `{ loading: true, done: false, error: null, payload: null } = stateProps`
 * will result on:
 * `loading: {previous: false, connected: true}`
 * `done: {previous: true, connected: false}`
 * `error: {previous null, connected: null}`
 * `payload: {previous: [], connected: null}`
 */
const connectorToState = connect(
  getGetterAsyncProps
)

/**
 * Given the loading prop detects if anything is loading
 * @param {Object|Boolean} loadingProp loading prop from the loaders
 */
const somethingLoading = (getter, props) => {
  const asyncPropNames = getAsyncKeys(getter)

  return asyncPropNames.some(name => {
    const asyncProp = props[name]
    return asyncProp.loading || (!asyncProp.payload && !asyncProp.error)
  })
}

/**
 * Returns a component connected to the desired async state, maped by the getter function, when the data is properly loaded.
 * Applies basic async status props to it
 * @param {function} getter mapper function
 * @param {function|object} loaderAction loader action that will be called when the component is mounted
 * @param {Component} LoadingComponent Loading component that will be shown when the component is loading
 * @param {Children} Children Components to be rendered with the state props
 */
class _StatusLoader extends Component {
  constructor (props) {
    super(props)
    // Bind the method to the component context
    this.renderChildren = this.renderChildren.bind(this)
  }

  componentDidMount () {
    const { loaderAction, dispatch } = this.props
    if (loaderAction) {
      dispatch(loaderAction)
    }
  }

  componentWillUnmount () {
    const { offloadingAction, dispatch } = this.props
    if (offloadingAction) {
      dispatch(offloadingAction)
    }
  }

  renderChildren () {
    const {
      getter,
      children,
      LoadingComponent,
      offloadingAction,
      loaderAction,
      ...props
    } = this.props

    return React.Children.map(children, child => {
      return React.cloneElement(child, props)
    })
  }

  render () {
    const { getter, LoadingComponent, ...props } = this.props
    const payloadLoading = somethingLoading(getter, props)
    return <Fragment>
      {
        payloadLoading && LoadingComponent
          ? <LoadingComponent />
          : this.renderChildren()
      }
    </Fragment>
  }
}

_StatusLoader.defaultProps = {
  LoadingComponent: LinearProgress
}

export const StatusLoader = connectorToState(_StatusLoader)
