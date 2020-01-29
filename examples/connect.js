import React, { Component } from 'react'
import { connect } from 'react-redux'
import LinearProgress from 'your-favorite-component-library/LoadingProgress'
import {
  getGetterAsyncProps, // deprecated
  getAsyncKeys // deprecated
} from 'resynchronize'

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
    return (
      <>
        {payloadLoading && LoadingComponent ? (<LoadingComponent />) : this.renderChildren()}
      </>
    )
  }
}

_StatusLoader.defaultProps = {
  LoadingComponent: LinearProgress
}

export const StatusLoader = connectorToState(_StatusLoader)
