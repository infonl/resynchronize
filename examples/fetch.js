import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import { ssoInstance } from '../utils/authentication'

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
      Accept: 'application/json',
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
