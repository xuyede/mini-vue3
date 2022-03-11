import { track, trigger } from "./effect"

export function ref(raw) {
  const r = {
    get value () {
      track(r, 'value')
      return raw
    },
    set value (newValue) {
      if (raw !== newValue) {
        raw = newValue
        trigger(r, 'value')
      }
    }
  }

  return r
}