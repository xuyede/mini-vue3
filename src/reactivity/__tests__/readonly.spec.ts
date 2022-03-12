import { isProxy, isReadonly, readonly } from '../reactive'

describe('reactivify/readonly', () => {
  it('happy path', () => {
    const raw = { foo: 1, bar: { baz: 2 } }

    const readonlyRaw = readonly(raw)
    expect(readonlyRaw).not.toBe(raw)
    expect(readonlyRaw.foo).toBe(1)
    expect(isReadonly(readonlyRaw)).toBe(true)
    expect(isReadonly(raw)).toBe(false)
    expect(isProxy(readonlyRaw)).toBe(true)
    expect(isProxy(raw)).toBe(false)
  })

  it('should not allow mutation', () => {
    console.warn = jest.fn()

    const raw = readonly({
      age: 11,
    })

    raw.age = 12
    expect(console.warn).toBeCalled()
  })

  it('should readonly nested object', () => {
    const raw = {
      array: [{ bar: 2 }],
      nested: {
        foo: 1,
      },
    }
    const readonlyRaw = readonly(raw)
    expect(isReadonly(readonlyRaw.array)).toBe(true)
    expect(isReadonly(readonlyRaw.nested)).toBe(true)
    expect(isReadonly(readonlyRaw.array[0])).toBe(true)
  })
})
