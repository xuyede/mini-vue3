import { track, trigger } from './effect'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter (isReadonly = false) {
    return function get (target, key, receive) {
        const result = Reflect.get(target, key, receive);

        if (!isReadonly) {
            track(target, key)
        }

        return result
    }
}

function createSetter () {
    return function set (target, key, value, receive) {
        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receive)
        if (result && oldValue !== value) {
            trigger(target, key)
        }
        return result
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set (_, key) {
        console.warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`
        )

        return true
    }
}