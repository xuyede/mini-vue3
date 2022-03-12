import { isObject } from '../shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receive) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const result = Reflect.get(target, key, receive)

    if (!isReadonly) {
      track(target, key)
    }

    if (shallow) {
      return result
    }

    if (isObject(result)) {
      return isReadonly ? readonly(result) : reactive(result)
    }

    return result
  }
}

function createSetter() {
  return function set(target, key, value, receive) {
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receive)
    if (result && oldValue !== value) {
      trigger(target, key)
    }
    return result
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(_, key) {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
    )

    return true
  },
}

export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(_, key) {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
    )

    return true
  },
}
