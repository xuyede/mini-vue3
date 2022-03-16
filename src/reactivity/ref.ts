import { createDep } from './dep'
import type { ReactiveEffect } from './effect'
import { activeEffect, shouldTrack, trackEffects, triggerEffects } from './effect'
import { toReactive } from './reactive'

class RefImpl<T> {
  private _value: T
  public dep?: Set<ReactiveEffect> = undefined

  constructor(value: T, isShallow?: boolean) {
    this._value = isShallow ? value : toReactive(value)
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

export function ref(raw) {
  return new RefImpl(raw, false)
}

export function shallowRef(raw) {
  return new RefImpl(raw, true)
}
