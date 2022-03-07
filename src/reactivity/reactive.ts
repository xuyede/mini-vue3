import { track, trigger } from './effect'

const baseHandler = {
    get (target, key, receive) {
        track(target, key)
        return Reflect.get(target, key, receive)
    },
    set (target, key, value, receive) {
        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receive)
        if (result && oldValue !== value) {
            trigger(target, key)
        }
        return result
    }
}

export function reactive (raw) {
    return new Proxy(raw, baseHandler)
}