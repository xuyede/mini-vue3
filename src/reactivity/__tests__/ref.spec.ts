import { effect } from "../effect"
import { ref } from "../ref"

describe('reactivify/ref', () => {
  it('happy path', () => {
    const age = ref(0)

    let newAge
    effect(() => {
      newAge = age.value
    })
    expect(newAge).toBe(0)
    age.value++
    expect(newAge).toBe(1)
  })
})