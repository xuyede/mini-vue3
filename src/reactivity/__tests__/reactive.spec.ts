import { isReactive, reactive } from '../reactive';

describe('reactivity/reactive', () => {
	it('happy path', () => {
		const raw = {
			age: 18
		}
		const proxyRaw = reactive(raw)
		expect(proxyRaw).not.toBe(raw)
		expect(proxyRaw.age).toBe(18)
		expect(isReactive(proxyRaw)).toBe(true)
	})
})