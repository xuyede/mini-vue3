describe('reactivify/readonly', () => {
    it('happy path', () => {
        const raw = { 
            foo: 1
        }

        const readonlyRaw = readonly(raw)
        expect(readonlyRaw).not.toBe(raw)
        expect(readonlyRaw.foo).toBe(1)
    })
})