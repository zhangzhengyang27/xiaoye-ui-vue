import { mount } from '@vue/test-utils';
import Row from './Row.tsx';

describe('Row.tsx', () => {
  it('renders xy-row container', () => {
    const wrapper = mount(Row, {
      slots: {
        default: '<div class="cell">cell</div>',
      },
    });

    expect(wrapper.find('.xy-row').exists()).toBe(true);
  });

  it('applies align and justify', () => {
    const wrapper = mount(Row, {
      props: {
        align: 'middle',
        justify: 'center',
      },
    });

    expect(wrapper.find('.xy-row-align-middle').exists()).toBe(true);
    expect(wrapper.find('.xy-row-justify-center').exists()).toBe(true);
  });

  it('applies gutter margins', () => {
    const wrapper = mount(Row, {
      props: {
        gutter: 16,
      },
    });

    const style = wrapper.find('.xy-row').attributes('style');

    expect(style).toContain('margin-left: -8px');
    expect(style).toContain('margin-right: -8px');
  });

  it('applies array gutter with vertical gap', () => {
    const wrapper = mount(Row, {
      props: {
        gutter: [16, 24],
      },
    });

    const style = wrapper.find('.xy-row').attributes('style');

    expect(style).toContain('margin-left: -8px');
    expect(style).toContain('margin-right: -8px');
    expect(style).toContain('row-gap: 24px');
  });

  it('renders nowrap modifier', () => {
    const wrapper = mount(Row, {
      props: {
        wrap: false,
      },
    });

    expect(wrapper.find('.xy-row-nowrap').exists()).toBe(true);
  });
});
