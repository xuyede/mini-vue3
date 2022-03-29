import { computed } from '../computed'
import { ref } from '../ref'

describe('reactivify/computed', () => {
  it('happy path', () => {
    const status = ref('success')
    const statusName = computed(() => {
      return `${status.value}-name`
    })

    expect(statusName.value).toBe('success-name')
  })
})
