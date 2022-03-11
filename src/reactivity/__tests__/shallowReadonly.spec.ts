import { isReadonly, shallowReadonly } from "../reactive";

describe('reactivify/shallowReadonly', () => {
  it('happy path', () => {
    const raw = { foo: 1, bar: { baz: 2 } };

		const readonlyRaw = shallowReadonly(raw)
		expect(readonlyRaw).not.toBe(raw)
		expect(readonlyRaw.foo).toBe(1)
		expect(isReadonly(readonlyRaw)).toBe(true)
  })

  it('should not allow mutation', () => {
		console.warn = jest.fn()

		const raw = shallowReadonly({
			age: 11
		})

		raw.age = 12
		expect(console.warn).toBeCalled()
	})

  it('should not to readonly nested object', () => {
		const raw = {
			array: [{ bar: 2 }],
			nested: {
				foo: 1
			}
		}
		const readonlyRaw = shallowReadonly(raw)
		expect(isReadonly(readonlyRaw.array)).toBe(false)
		expect(isReadonly(readonlyRaw.nested)).toBe(false)
		expect(isReadonly(readonlyRaw.array[0])).toBe(false)
	})
})