import { isProxy, isReactive, reactive } from '../reactive';

describe('reactivity/reactive', () => {
	it('happy path', () => {
		const raw = {
			age: 18
		}
		const proxyRaw = reactive(raw)
		expect(proxyRaw).not.toBe(raw)
		expect(proxyRaw.age).toBe(18)
		expect(isReactive(proxyRaw)).toBe(true)
		expect(isReactive(raw)).toBe(false)
		expect(isProxy(proxyRaw)).toBe(true)
		expect(isProxy(raw)).toBe(false)
	})

	it('should reactive nested object', () => {
		const raw = {
			array: [{ bar: 2 }],
			nested: {
				foo: 1
			}
		}

		const proxyRaw = reactive(raw)
		expect(isReactive(proxyRaw.nested)).toBe(true)
		expect(isReactive(proxyRaw.array)).toBe(true)
		expect(isReactive(proxyRaw.array[0])).toBe(true)
	})
})