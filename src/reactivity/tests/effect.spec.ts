import { reactive } from '../reactive'
import { effect } from '../effect'

describe('effect', () => {
    it('happy path', () => {

        const user = reactive({
            age: 10
        });

        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        });

        expect(nextAge).toBe(11);

        // update
        user.age++
        expect(nextAge).toBe(12);
    })

    it('effect runner', () => {
        let age = 10
        const runner = effect(() => {
            age++
            return 'age'
        })

        expect(age).toBe(11)
        const str = runner()
        expect(age).toBe(12)
        expect(str).toBe('age')
    })

    it('scheduler', () => {
        /**
            1. effect 第一次执行时，不会触发 scheduler
            2. 监听的数据改变的时候，schedule 会被触发，effect 不会触发
            3. runner执行的时候，effect 会触发，schedule 不会触发
         */

        let dummy
        let run: any
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            { scheduler }
        )
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // should be called on first trigger
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        // should not run yet
        expect(dummy).toBe(1)
        // manually run
        run()
        // should have run
        expect(dummy).toBe(2)
    })
})