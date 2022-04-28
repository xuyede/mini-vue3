import { NOOP, isFunction } from '../shared'
import type { Dep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

export type ComputedGetter<T> = (...args: any[]) => T
export type ComputedSetter<T> = (v: T) => void
export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

export class ComputedRefImpl<T> {
  public dep?: Dep = undefined
  public readonly effect: ReactiveEffect

  private _value!: T
  public _dirty = true

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        // triggerRefValue(this)
      }
    })
  }

  get value() {
    // trackRefValue(this)
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }

    return this._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
export function computed<T>(
  getter: ComputedGetter<T>,
)
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
) {
  let _getter: ComputedGetter<T>
  let _setter: ComputedSetter<T>

  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    _getter = getterOrOptions as ComputedGetter<T>
    _setter = NOOP
  }
  else {
    const options = getterOrOptions as WritableComputedOptions<T>
    _getter = options.get
    _setter = options.set
  }

  const cRef = new ComputedRefImpl(_getter, _setter)
  return cRef
}
