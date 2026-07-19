import { mount } from '@vue/test-utils';
import ImageCompare from '../ImageCompare';

describe('ImageCompare', () => {
  it('should render with default value 50', () => {
    const wrapper = mount(ImageCompare, {
      slots: {
        left: '<img src="left.jpg" alt="left" />',
        right: '<img src="right.jpg" alt="right" />',
      },
    });
    expect(wrapper.find('.xy-image-compare').exists()).toBe(true);
    expect(wrapper.find('.xy-image-compare-layer-left').exists()).toBe(true);
    expect(wrapper.find('.xy-image-compare-layer-right').exists()).toBe(true);
    expect(wrapper.find('input[type="range"]').exists()).toBe(true);
    expect(wrapper.find('input[type="range"]').element.value).toBe('50');
  });

  it('should handle value change', async () => {
    const onChange = vi.fn();
    const wrapper = mount(ImageCompare, {
      props: { onChange },
      slots: {
        left: '<img src="left.jpg" alt="left" />',
        right: '<img src="right.jpg" alt="right" />',
      },
    });
    await wrapper.find('input[type="range"]').setValue(75);
    expect(onChange).toHaveBeenCalledWith(75);
  });

  it('should support controlled value', async () => {
    const wrapper = mount(ImageCompare, {
      props: { value: 30 },
      slots: {
        left: '<img src="left.jpg" alt="left" />',
        right: '<img src="right.jpg" alt="right" />',
      },
    });
    expect(wrapper.find('input[type="range"]').element.value).toBe('30');
  });

  it('should support disabled', () => {
    const wrapper = mount(ImageCompare, {
      props: { disabled: true },
      slots: {
        left: '<img src="left.jpg" alt="left" />',
        right: '<img src="right.jpg" alt="right" />',
      },
    });
    expect(wrapper.find('.xy-image-compare-disabled').exists()).toBe(true);
    expect(wrapper.find('input[type="range"]').element.disabled).toBe(true);
  });
});
