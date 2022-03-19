import { createDep } from './dep'
import type { ReactiveEffect } from './effect'
import { activeEffect, shouldTrack, trackEffects, triggerEffects } from './effect'
import { toReactive } from './reactive'

class RefImpl<T> {
  private _value: T
  public readonly __v_isRef = true
  public dep?: Set<ReactiveEffect> = undefined

  constructor(value: T, public readonly __v_isShallow?: boolean) {
    this._value = __v_isShallow ? value : toReactive(value)
    this.__v_isRef = true
  }

  get value() {
    if (shouldTrack && activeEffect) {
      trackEffects(this.dep || (this.dep = createDep()))
    }
    return this._value
  }

  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue

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
