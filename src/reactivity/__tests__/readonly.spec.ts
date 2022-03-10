import { isReadonly, readonly } from "../reactive";

describe('reactivify/readonly', () => {
	it('happy path', () => {
		const raw = { foo: 1, bar: { baz: 2 } };

		const readonlyRaw = readonly(raw)
		expect(readonlyRaw).not.toBe(raw)
		expect(readonlyRaw.foo).toBe(1)
		expect(isReadonly(readonlyRaw)).toBe(true)
	})

	it('should not allow mutation', () => {
		console.warn = jest.fn()

		const raw = readonly({
			age: 11
		})

		raw.age = 12
		expect(console.warn).toBeCalled()
	})
})