import { mount } from '@vue/test-utils';
import Rating from '../Rating';

describe('Rating', () => {
  it('should render with default count 5', () => {
    const wrapper = mount(Rating);
    expect(wrapper.find('.xy-rating').exists()).toBe(true);
    expect(wrapper.findAll('.xy-rating-star').length).toBe(5);
  });

  it('should handle value change', async () => {
    const onChange = vi.fn();
    const wrapper = mount(Rating, {
      props: { onChange },
    });
    await wrapper.findAll('input[type="radio"]')[2].setValue(true);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('should clear value when allowClear and click same value', async () => {
    const onChange = vi.fn();
    const wrapper = mount(Rating, {
      props: { value: 3, onChange },
    });
    await wrapper.findAll('input[type="radio"]')[2].trigger('change');
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('should support disabled', () => {
    const wrapper = mount(Rating, {
      props: { disabled: true },
    });
    expect(wrapper.find('.xy-rating-disabled').exists()).toBe(true);
    expect(wrapper.find('input[type="radio"]').attributes('disabled')).toBeDefined();
  });

  it('should support readonly', () => {
    const wrapper = mount(Rating, {
      props: { readonly: true },
    });
    expect(wrapper.find('.xy-rating-readonly').exists()).toBe(true);
  });
});
