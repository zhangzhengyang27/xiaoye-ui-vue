import { mount } from '@vue/test-utils';
import ToggleButton from '../ToggleButton';

describe('ToggleButton', () => {
  it('should render single toggle button', () => {
    const wrapper = mount(ToggleButton);
    expect(wrapper.find('.xy-toggle-button').exists()).toBe(true);
    expect(wrapper.find('.xy-toggle-button-label').text()).toBe('Off');
  });

  it('should toggle value on click', async () => {
    const onChange = vi.fn();
    const wrapper = mount(ToggleButton, {
      props: { onChange },
    });
    await wrapper.find('button').trigger('click');
    expect(onChange).toHaveBeenCalledWith(true);
    expect(wrapper.find('.xy-toggle-button-checked').exists()).toBe(true);
  });

  it('should support options group', async () => {
    const onChange = vi.fn();
    const wrapper = mount(ToggleButton, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
        onChange,
      },
    });
    expect(wrapper.find('.xy-toggle-button-group').exists()).toBe(true);
    expect(wrapper.findAll('.xy-toggle-button').length).toBe(2);
    await wrapper.findAll('button')[1].trigger('click');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('should support multiple options group', async () => {
    const onChange = vi.fn();
    const wrapper = mount(ToggleButton, {
      props: {
        value: ['a'],
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
        multiple: true,
        onChange,
      },
    });
    await wrapper.findAll('button')[1].trigger('click');
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('should support disabled', () => {
    const wrapper = mount(ToggleButton, {
      props: { disabled: true },
    });
    expect(wrapper.find('.xy-toggle-button-disabled').exists()).toBe(true);
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });
});
