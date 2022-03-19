import { effect } from '../effect'
import { reactive } from '../reactive'
import { isRef, ref, unRef } from '../ref'

describe('reactivify/ref', () => {
  it('happy path', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
    a.value = 2
    expect(a.value).toBe(2)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    a.value = 2
    expect(calls).toBe(2)
  })

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1,
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('should work without initial value', () => {
    const a = ref()
    let dummy
    effect(() => {
      dummy = a.value
    })
    expect(dummy).toBe(undefined)
    a.value = 2
    expect(dummy).toBe(2)
  })

  it('should pass isRef method', () => {
    const r = ref()
    const p = reactive({
      age: 1,
    })

    expect(isRef(1)).toBe(false)
    expect(isRef(r)).toBe(true)
    expect(isRef(p)).toBe(false)
  })

  it('shoulud pass unRef methods', () => {
    const a = ref(1)
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })
})
