import { effect } from './effect'
import { ref } from './ref'

export function computed(fn) {
  const r = ref()

  effect(() => {
    r.value = fn()
  })

  return r
}
