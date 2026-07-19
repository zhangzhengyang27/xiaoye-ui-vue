import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VirtualList from '../VirtualList';
import VirtualListDefault, { virtualListProps } from '..';
import mountTest from '../../../tests/shared/mountTest';

// jsdom 不实现 Element.scrollTo，需 mock 以便 scrollTo/scrollToIndex 不抛错
if (!window.HTMLElement.prototype.scrollTo) {
  window.HTMLElement.prototype.scrollTo = () => {};
}

describe('VirtualList', () => {
  mountTest(VirtualList);

  const sampleItems = Array.from({ length: 100 }, (_, i) => ({ id: i, label: `Item ${i}` }));

  let originalOffsetHeight;
  let originalOffsetWidth;
  let originalOffsetParent;

  beforeAll(() => {
    originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    originalOffsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent');
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get() {
        return document.body;
      },
    });
  });

  afterAll(() => {
    if (originalOffsetHeight) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    }
    if (originalOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    }
    if (originalOffsetParent) {
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', originalOffsetParent);
    }
  });

  it('marks with __XY_VIRTUAL_LIST flag', () => {
    expect(VirtualList.__XY_VIRTUAL_LIST).toBe(true);
  });

  it('has install function', () => {
    expect(typeof VirtualList.install).toBe('function');
  });

  it('default export and named export reference same component', () => {
    expect(VirtualListDefault).toBe(VirtualList);
  });

  it('exports virtualListProps function', () => {
    expect(typeof virtualListProps).toBe('function');
  });

  it('renders correctly with xy-virtual-list container and content', () => {
    const wrapper = mount(VirtualList, {
      props: { items: sampleItems, itemSize: 20 },
      slots: {
        item: '<span class="item-slot">item</span>',
      },
    });
    expect(wrapper.find('.xy-virtual-list').exists()).toBe(true);
    expect(wrapper.find('.xy-virtual-list-content').exists()).toBe(true);
    expect(wrapper.find('.xy-virtual-list-spacer').exists()).toBe(true);
    wrapper.unmount();
  });

  it('updates scroll offset and emits scroll-index-change', async () => {
    const wrapper = mount(VirtualList, {
      props: { items: sampleItems, itemSize: 20 },
      slots: {
        item: '<span class="item-slot">item</span>',
      },
      attachTo: document.body,
    });
    await nextTick();

    const el = wrapper.find('.xy-virtual-list').element;
    Object.defineProperty(el, 'scrollTop', { value: 200, configurable: true, writable: true });
    await wrapper.find('.xy-virtual-list').trigger('scroll');

    expect(wrapper.emitted('scroll')).toBeTruthy();
    expect(wrapper.emitted('scroll-index-change')).toBeTruthy();

    const firstEvent = wrapper.emitted('scroll-index-change')[0][0];
    expect(firstEvent.first).toBeGreaterThan(0);
    wrapper.unmount();
  });

  it('renders only viewport plus buffer items', async () => {
    const wrapper = mount(VirtualList, {
      props: { items: sampleItems, itemSize: 20 },
      slots: {
        item: '<span class="item-slot">item</span>',
      },
      attachTo: document.body,
    });
    await nextTick();

    const renderedItems = wrapper.findAll('.item-slot');
    // offsetHeight=100, itemSize=20 -> viewport=5, tolerated=3, last=0+5+2*3=11
    expect(renderedItems.length).toBeGreaterThan(0);
    expect(renderedItems.length).toBeLessThan(sampleItems.length);
    expect(renderedItems.length).toBeLessThanOrEqual(11);
    wrapper.unmount();
  });

  it('updates spacer height when itemSize changes dynamically', async () => {
    const wrapper = mount(VirtualList, {
      props: { items: sampleItems, itemSize: 20 },
      slots: {
        item: '<span class="item-slot">item</span>',
      },
      attachTo: document.body,
    });
    await nextTick();

    const spacerEl = wrapper.find('.xy-virtual-list-spacer').element;
    const initialHeight = spacerEl.style.height;
    expect(initialHeight).toBe(`${sampleItems.length * 20}px`);

    await wrapper.setProps({ itemSize: 50 });
    await nextTick();

    expect(spacerEl.style.height).toBe(`${sampleItems.length * 50}px`);
    wrapper.unmount();
  });

  it('updates rendered items when items prop changes dynamically', async () => {
    const wrapper = mount(VirtualList, {
      props: { items: sampleItems, itemSize: 20 },
      slots: {
        item: '<span class="item-slot">item</span>',
      },
      attachTo: document.body,
    });
    await nextTick();

    const initialCount = wrapper.findAll('.item-slot').length;

    const newItems = Array.from({ length: 10 }, (_, i) => ({ id: i, label: `New ${i}` }));
    await wrapper.setProps({ items: newItems });
    await nextTick();

    const newCount = wrapper.findAll('.item-slot').length;
    expect(newCount).toBeLessThanOrEqual(initialCount);
    expect(newCount).toBeLessThanOrEqual(newItems.length);
    wrapper.unmount();
  });
});
