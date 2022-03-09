import { extend } from '../shared/index'

let activeEffect: ReactiveEffect | undefined;

class ReactiveEffect {
    private _fn: any

    private active:boolean =  true

    public deps: Set<ReactiveEffect>[] = []

    constructor (fn) {
        this._fn = fn
    }

    run () {
        if (!this.active) {
            return this._fn();
        }

        activeEffect = this;
        const result = this._fn();
        activeEffect = undefined;

        return result;
    }

    stop () {
        if (this.active) {
            this.deps.forEach(dep => {
                dep.delete(this);
            })
    
            this.deps.length = 0;

            this.active = false;
        }
    }
}

export interface ReactiveEffectRunner<T = any> {
    (): T
    effect: ReactiveEffect
}

export interface ReactiveEffectOptions {
    scheduler?: (...args: any[]) => any 
}

export function effect<T = any> (
    fn: () => T,
    options?: ReactiveEffectOptions
): ReactiveEffectRunner {
    const _effect = new ReactiveEffect(fn);

    if (options) {
        extend(_effect, options);
    }

    _effect.run();

    const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
    runner.effect = _effect
    return runner
}

export function stop (runner: ReactiveEffectRunner) {
    runner.effect.stop();
}

const targetMap = new WeakMap()

export function track (target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            depsMap = new Map()
            targetMap.set(target, depsMap)
        }

        let dep = depsMap.get(key)
        if (!dep) {
            dep = new Set()
            depsMap.set(key, dep)
        }

        if (!dep.has(activeEffect)) {
            dep.add(activeEffect)
            activeEffect.deps.push(dep);
        }
    }
}

export function trigger (target, key) {
    const depsMap = targetMap.get(target)

    if (!depsMap) return

    const dep = depsMap.get(key)

    for (let effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}