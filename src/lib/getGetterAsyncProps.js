import getAsyncProps from './getAsyncProps'

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

const getAsyncKeys = getter =>
  getter && typeof getter === 'object'
    ? Object.keys(getter)
    : ['asyncProp']

const getGetterAsyncProps = (state, props) => {
  const { getter } = props

  let newAsyncProps = {}

  getAsyncKeys(getter).forEach(key => {
    const newProp = getAsyncProps(
      getter[key](state)
    )
    newAsyncProps[key] = fuseProps(props[key], newProp)
  })

  return newAsyncProps
}

export {
  getAsyncKeys,
  getGetterAsyncProps as default
}
