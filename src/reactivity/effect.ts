import { extend } from '../shared/index'
import type { Target } from './reactive'

export type EffectScheduler = (...anys: any[]) => any

export let activeEffect: ReactiveEffect | undefined
export let shouldTrack = true

export class ReactiveEffect {
  public deps: Set<ReactiveEffect>[] = []

  private _fn: any
  private active = true
  private onStop?: () => void

  constructor(
    fn,
    public scheduler: EffectScheduler | null = null,
  ) {
    this._fn = fn
  }

  run() {
    if (!this.active) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this

    const result = this._fn()

    shouldTrack = false
    activeEffect = undefined

    return result
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

export interface ReactiveEffectOptions {
  onStop?: () => void
  scheduler?: (...args: any[]) => any
}

export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions,
): ReactiveEffectRunner {
  const _effect = new ReactiveEffect(fn)

  if (options) {
    extend(_effect, options)
  }

  _effect.run()

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}

const targetMap = new WeakMap()

export function track(target: Target, key: string) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }

    trackEffects(dep)
  }
}

export function trackEffects(dep: Set<ReactiveEffect>) {
  if (!dep.has(activeEffect!)) {
    dep.add(activeEffect!)
    activeEffect!.deps.push(dep)
  }
}

export function trigger(target: Target, key: string) {
  const depsMap = targetMap.get(target)

  if (!depsMap) return

  const dep = depsMap.get(key)

  triggerEffects(dep)
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    }
    else {
      effect.run()
    }
  }
}
