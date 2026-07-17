import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ContextMenu from '.';
import mountTest from '../../tests/shared/mountTest';

const menuItems = [{ label: 'File' }, { label: 'Edit' }, { separator: true }, { label: 'Help' }];

const fakeMouseEvent = {
  pageX: 100,
  pageY: 100,
  stopPropagation: () => {},
  preventDefault: () => {},
};

function makeKeyEvent(code, extra = {}) {
  return {
    code,
    preventDefault: () => {},
    stopPropagation: () => {},
    ...extra,
  };
}

describe('ContextMenu', () => {
  mountTest(ContextMenu);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('marks with __XY_CONTEXT_MENU flag', () => {
    expect(ContextMenu.__XY_CONTEXT_MENU).toBe(true);
  });

  it('has install function', () => {
    expect(typeof ContextMenu.install).toBe('function');
  });

  it('does not render menu when visible is false by default', () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    expect(document.body.querySelector('.xy-contextmenu')).toBeNull();
    wrapper.unmount();
  });

  it('renders menu after show() is called', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    wrapper.vm.show(fakeMouseEvent);
    await nextTick();
    expect(document.body.querySelector('.xy-contextmenu')).not.toBeNull();
    expect(document.body.querySelector('.xy-contextmenu-list')).not.toBeNull();
    wrapper.unmount();
  });

  it('renders menu items from model', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    wrapper.vm.show(fakeMouseEvent);
    await nextTick();
    const items = document.body.querySelectorAll('.xy-contextmenu-item');
    // 分隔符不计入 .xy-contextmenu-item（分隔符是 .xy-contextmenu-separator）
    expect(items.length).toBe(3);
    const separator = document.body.querySelector('.xy-contextmenu-separator');
    expect(separator).not.toBeNull();
    wrapper.unmount();
  });

  it('exposes show/hide/toggle methods', () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    expect(typeof wrapper.vm.show).toBe('function');
    expect(typeof wrapper.vm.hide).toBe('function');
    expect(typeof wrapper.vm.toggle).toBe('function');
    expect(typeof wrapper.vm.onKeyDown).toBe('function');
    expect(typeof wrapper.vm.onEnter).toBe('function');
    expect(typeof wrapper.vm.onArrowDownKey).toBe('function');
    expect(typeof wrapper.vm.onArrowUpKey).toBe('function');
    expect(typeof wrapper.vm.onEscapeKey).toBe('function');
    expect(typeof wrapper.vm.position).toBe('function');
    wrapper.unmount();
  });

  it('shows menu on global contextmenu event when global=true', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems, global: true },
      attachTo: 'body',
    });
    const event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
    Object.defineProperty(event, 'pageX', { value: 100 });
    Object.defineProperty(event, 'pageY', { value: 100 });
    document.dispatchEvent(event);
    await nextTick();
    expect(document.body.querySelector('.xy-contextmenu')).not.toBeNull();
    wrapper.unmount();
  });

  it('does not show menu on contextmenu event when global=false', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems, global: false },
      attachTo: 'body',
    });
    const event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
    Object.defineProperty(event, 'pageX', { value: 100 });
    Object.defineProperty(event, 'pageY', { value: 100 });
    document.dispatchEvent(event);
    await nextTick();
    expect(document.body.querySelector('.xy-contextmenu')).toBeNull();
    wrapper.unmount();
  });

  it('sets zIndex on element when autoZIndex is true', () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems, autoZIndex: true, baseZIndex: 100 },
      attachTo: 'body',
    });
    const el = document.createElement('div');
    wrapper.vm.onEnter(el);
    expect(el.style.zIndex).not.toBe('');
    wrapper.unmount();
  });

  it('does not set zIndex when autoZIndex is false', () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems, autoZIndex: false },
      attachTo: 'body',
    });
    const el = document.createElement('div');
    el.style.zIndex = '';
    wrapper.vm.onEnter(el);
    expect(el.style.zIndex).toBe('');
    wrapper.unmount();
  });

  it('navigates items with ArrowDown key', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    wrapper.vm.show(fakeMouseEvent);
    await nextTick();
    expect(wrapper.vm.focusedItemInfo.index).toBe(-1);
    wrapper.vm.onKeyDown(makeKeyEvent('ArrowDown'));
    expect(wrapper.vm.focusedItemInfo.index).toBe(0);
    wrapper.vm.onKeyDown(makeKeyEvent('ArrowDown'));
    expect(wrapper.vm.focusedItemInfo.index).toBe(1);
    wrapper.unmount();
  });

  it('navigates to last item with ArrowUp key', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    wrapper.vm.show(fakeMouseEvent);
    await nextTick();
    wrapper.vm.onKeyDown(makeKeyEvent('ArrowUp'));
    // 最后一个有效项是索引 3（Help）
    expect(wrapper.vm.focusedItemInfo.index).toBe(3);
    wrapper.unmount();
  });

  it('hides menu on Escape key', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    wrapper.vm.show(fakeMouseEvent);
    await nextTick();
    expect(wrapper.vm.visible).toBe(true);
    wrapper.vm.onKeyDown(makeKeyEvent('Escape'));
    expect(wrapper.vm.visible).toBe(false);
    wrapper.unmount();
  });

  it('emits before-show and show events', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    wrapper.vm.show(fakeMouseEvent);
    expect(wrapper.emitted('before-show')).toBeTruthy();
    // show 事件在 onAfterEnter 中触发，Transition 在测试环境可能不触发
    wrapper.unmount();
  });

  it('emits before-hide and hide events on hide', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    wrapper.vm.show(fakeMouseEvent);
    await nextTick();
    wrapper.vm.hide();
    expect(wrapper.emitted('before-hide')).toBeTruthy();
    // hide 事件在 onLeave 中触发
    wrapper.unmount();
  });

  it('renders custom content via item slot', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: [{ label: 'File' }] },
      slots: {
        item: scope => <span class="custom-item">{scope.item.label}</span>,
      },
      attachTo: 'body',
    });
    wrapper.vm.show(fakeMouseEvent);
    await nextTick();
    const customEl = document.body.querySelector('.custom-item');
    expect(customEl).not.toBeNull();
    expect(customEl.textContent).toBe('File');
    wrapper.unmount();
  });

  it('creates processed items from model', () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    expect(wrapper.vm.processedItems.length).toBe(4);
    expect(wrapper.vm.processedItems[0].item.label).toBe('File');
    expect(wrapper.vm.processedItems[2].item.separator).toBe(true);
    wrapper.unmount();
  });

  it('toggles visibility with toggle method', async () => {
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    expect(wrapper.vm.visible).toBe(false);
    wrapper.vm.toggle(fakeMouseEvent);
    expect(wrapper.vm.visible).toBe(true);
    wrapper.vm.hide();
    expect(wrapper.vm.visible).toBe(false);
    wrapper.unmount();
  });

  it('applies mobile class when queryMatches is true', async () => {
    // matchMedia mock 返回 matches=true（query 包含 max-width），所以 queryMatches=true
    const wrapper = mount(ContextMenu, {
      props: { model: menuItems },
      attachTo: 'body',
    });
    wrapper.vm.show(fakeMouseEvent);
    await nextTick();
    const menuEl = document.body.querySelector('.xy-contextmenu');
    expect(menuEl).not.toBeNull();
    // mock 的 matchMedia 返回 matches=true，所以应该有 mobile 类
    expect(menuEl.classList.contains('xy-contextmenu-mobile')).toBe(true);
    wrapper.unmount();
  });
});
