import { hasChanged } from '../shared'
import { createDep } from './dep'
import type { ReactiveEffect } from './effect'
import { activeEffect, shouldTrack, trackEffects, triggerEffects } from './effect'
import { isReactive, toReactive } from './reactive'

class RefImpl<T> {
  private _value: T
  private _rawValue: T
  public readonly __v_isRef = true
  public dep?: Set<ReactiveEffect> = undefined

  constructor(value: T, public readonly __v_isShallow?: boolean) {
    this._value = __v_isShallow ? value : toReactive(value)
    this._rawValue = value
  }

  get value() {
    if (shouldTrack && activeEffect) {
      trackEffects(this.dep || (this.dep = createDep()))
    }
    return this._value
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = this.__v_isShallow ? newValue : toReactive(newValue)

      if (this.dep) {
        triggerEffects(this.dep)
      }
    }
  }
}

export function isRef(r: any) {
  return !!(r && r.__v_isRef === true)
}

export function unRef(r: any) {
  return isRef(r) ? r.value : r
}

function createRef(raw, shallow: boolean) {
  if (isRef(raw)) {
    return raw
  }

  return new RefImpl(raw, shallow)
}

export function ref(raw?) {
  return createRef(raw, false)
}

export function shallowRef(raw?) {
  return createRef(raw, true)
}

const shallowUnwrapHandlers = {
  get(target, key, receive) {
    return unRef(Reflect.get(target, key, receive))
  },
  set(target, key, value, receive) {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value
      return true
    }

    return Reflect.set(target, key, value, receive)
  },
}

// 用于模板解析 setup 吐出来的ref
export function proxyRefs<T extends object>(raw: T) {
  return isReactive(raw)
    ? raw
    : new Proxy(raw, shallowUnwrapHandlers)
}
