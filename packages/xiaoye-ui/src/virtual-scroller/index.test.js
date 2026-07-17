import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VirtualScroller from './VirtualScroller';
import VirtualScrollerDefault, { virtualScrollerProps } from '.';
import mountTest from '../../tests/shared/mountTest';

// jsdom 不实现 Element.scrollTo，需 mock 以便 scrollTo/scrollToIndex 不抛错
if (!window.HTMLElement.prototype.scrollTo) {
  window.HTMLElement.prototype.scrollTo = () => {};
}

describe('VirtualScroller', () => {
  mountTest(VirtualScroller);

  const sampleItems = Array.from({ length: 20 }, (_, i) => ({ id: i, label: `Item ${i}` }));

  it('marks with __XY_VIRTUAL_SCROLLER flag', () => {
    expect(VirtualScroller.__XY_VIRTUAL_SCROLLER).toBe(true);
  });

  it('has install function', () => {
    expect(typeof VirtualScroller.install).toBe('function');
  });

  it('default export and named export reference same component', () => {
    expect(VirtualScrollerDefault).toBe(VirtualScroller);
  });

  it('exports virtualScrollerProps function', () => {
    expect(typeof virtualScrollerProps).toBe('function');
  });

  it('renders the xy-virtualscroller container with items and itemSize', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30 },
      slots: {
        item: '<span class="item-slot">item</span>',
      },
    });
    expect(wrapper.find('.xy-virtualscroller').exists()).toBe(true);
    // jsdom 下 offsetWidth/offsetHeight 为 0，last=0，不渲染实际项目，但 content 容器应存在
    expect(wrapper.find('.xy-virtualscroller-content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders default slot directly when disabled', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30, disabled: true },
      slots: {
        default: '<div class="disabled-default">disabled content</div>',
      },
    });
    // disabled 时不渲染 xy-virtualscroller 容器
    expect(wrapper.find('.xy-virtualscroller').exists()).toBe(false);
    // 直接渲染 default slot
    expect(wrapper.find('.disabled-default').exists()).toBe(true);
    expect(wrapper.find('.disabled-default').text()).toBe('disabled content');
    wrapper.unmount();
  });

  it('applies xy-virtualscroller-horizontal class for horizontal orientation', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30, orientation: 'horizontal' },
    });
    expect(wrapper.find('.xy-virtualscroller').classes()).toContain(
      'xy-virtualscroller-horizontal',
    );
    wrapper.unmount();
  });

  it('applies xy-virtualscroller-both class for both orientation', () => {
    const wrapper = mount(VirtualScroller, {
      props: {
        items: sampleItems,
        itemSize: [30, 100],
        orientation: 'both',
        columns: sampleItems,
      },
    });
    expect(wrapper.find('.xy-virtualscroller').classes()).toContain('xy-virtualscroller-both');
    wrapper.unmount();
  });

  it('applies xy-virtualscroller-inline class when inline prop is true', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30, inline: true },
    });
    expect(wrapper.find('.xy-virtualscroller').classes()).toContain('xy-virtualscroller-inline');
    wrapper.unmount();
  });

  it('renders spacer by default', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30 },
    });
    expect(wrapper.find('.xy-virtualscroller-spacer').exists()).toBe(true);
    wrapper.unmount();
  });

  it('does not render spacer when showSpacer is false', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30, showSpacer: false },
    });
    expect(wrapper.find('.xy-virtualscroller-spacer').exists()).toBe(false);
    wrapper.unmount();
  });

  it('renders content slot with provided props', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30 },
      slots: {
        content: '<div class="custom-content">custom content</div>',
      },
    });
    expect(wrapper.find('.custom-content').exists()).toBe(true);
    expect(wrapper.find('.custom-content').text()).toBe('custom content');
    wrapper.unmount();
  });

  it('renders loading icon when showLoader and loading are true', async () => {
    const wrapper = mount(VirtualScroller, {
      props: {
        items: sampleItems,
        itemSize: 30,
        showLoader: true,
        loading: true,
        lazy: true,
      },
    });
    await nextTick();
    // lazy + loading 触发 d_loading=true，渲染 loader
    expect(wrapper.find('.xy-virtualscroller-loader').exists()).toBe(true);
    expect(wrapper.find('.xy-virtualscroller-loading-icon').exists()).toBe(true);
    wrapper.unmount();
  });

  it('exposes scrollTo and scrollToIndex methods', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30 },
    });
    expect(typeof wrapper.vm.scrollTo).toBe('function');
    expect(typeof wrapper.vm.scrollToIndex).toBe('function');
    wrapper.unmount();
  });

  it('exposes getOptions and getLoaderOptions methods', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30 },
    });
    expect(typeof wrapper.vm.getOptions).toBe('function');
    expect(typeof wrapper.vm.getLoaderOptions).toBe('function');
    wrapper.unmount();
  });

  it('exposes element and content refs', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30 },
    });
    expect(wrapper.vm.element).toBeDefined();
    expect(wrapper.vm.content).toBeDefined();
    wrapper.unmount();
  });

  it('scrollToIndex does not throw for valid index', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30 },
    });
    expect(() => wrapper.vm.scrollToIndex(5)).not.toThrow();
    wrapper.unmount();
  });

  it('scrollTo does not throw', () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30 },
    });
    expect(() => wrapper.vm.scrollTo({ top: 100, left: 0 })).not.toThrow();
    wrapper.unmount();
  });

  it('emits scroll event on scroll', async () => {
    const wrapper = mount(VirtualScroller, {
      props: { items: sampleItems, itemSize: 30 },
      attachTo: 'body',
    });
    await wrapper.find('.xy-virtualscroller').trigger('scroll');
    expect(wrapper.emitted('scroll')).toBeTruthy();
    wrapper.unmount();
  });
});
