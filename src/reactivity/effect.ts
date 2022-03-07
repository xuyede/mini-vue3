let activeEffect: ReactiveEffect | undefined;

class ReactiveEffect {
    private _fn: any

    constructor (fn) {
        this._fn = fn
    }

    run () {
        activeEffect = this;
        this._fn();
        activeEffect = undefined;
    }
}

export function effect (fn) {
    const _effect = new ReactiveEffect(fn);

    _effect.run();
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
        }
    }
}

export function trigger (target, key) {
    const depsMap = targetMap.get(target)

    if (!depsMap) return

    const dep = depsMap.get(key)

    for (let effect of dep) {
        effect.run()
    }
}