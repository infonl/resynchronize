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

const getAsyncKeys = getter => {
  let asyncProps = ['asyncProp']

  if (typeof getter === 'object') {
    asyncProps = Object.keys(getter).map(key => key)
  }

  return asyncProps
}

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
  getGetterAsyncProps as default
}
