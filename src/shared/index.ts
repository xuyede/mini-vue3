export const extend = Object.assign

export const toSting = Object.prototype.toString

export const isObject = (obj) => {
  return obj !== null && typeof obj === 'object'
}

export const isString = key => typeof key === 'string'

export const isArray = Array.isArray

export const isFunction = key => toSting.call(key) === '[object Function]'

export const isIntegerKey = key =>
  isString(key)
  && key !== 'NaN'
  && key[0] !== '-'
  && `${parseInt(key, 10)}` === key

export const hasChanged = (value, oldValue) => {
  return !Object.is(value, oldValue)
}

export const NOOP = () => {}
