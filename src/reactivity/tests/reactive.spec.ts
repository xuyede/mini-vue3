import { reactive } from '../reactive';

describe('reactive', () => {
    it('happy path', () => {
        const raw = { 
            age: 18
        }
        const proxyRaw = reactive(raw)
        expect(proxyRaw).not.toBe(raw)
        expect(proxyRaw.age).toBe(18)
    })
})