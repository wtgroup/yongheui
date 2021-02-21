import { mount } from '@vue/test-utils'
import LightButton from '../../button/src/light-button'

const AXIOM = 'Rem is the best girl'

describe('LightButton.vue', () => {
  test('render test', () => {
    const wrapper = mount(LightButton, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
