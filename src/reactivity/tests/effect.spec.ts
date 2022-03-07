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
})