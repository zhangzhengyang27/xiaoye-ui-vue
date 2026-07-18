import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SortableList from '../SortableList';
import SortableItem from '../SortableItem';
import SortableListDefault, { SortableItem as SortableItemNamed } from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('SortableList', () => {
  mountTest(SortableList);
  // SortableItem 必须在 DragDropProvider 内使用，不单独进行 mountTest

  const basicItems = [
    { key: '1', label: '列表项 1' },
    { key: '2', label: '列表项 2' },
    { key: '3', label: '列表项 3' },
  ];

  it('renders list with default vertical axis', () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems },
      sync: false,
    });
    expect(wrapper.find('.xy-sortable-list').exists()).toBe(true);
    expect(wrapper.find('.xy-sortable-list').classes()).toContain('xy-sortable-list-y');
    expect(wrapper.findAll('.xy-sortable-list-item').length).toBe(3);
    wrapper.unmount();
  });

  it('applies horizontal axis class', () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, axis: 'x' },
      sync: false,
    });
    expect(wrapper.find('.xy-sortable-list').classes()).toContain('xy-sortable-list-x');
    wrapper.unmount();
  });

  it('applies disabled class when disabled prop is true', () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, disabled: true },
      sync: false,
    });
    expect(wrapper.find('.xy-sortable-list').classes()).toContain('xy-sortable-list-disabled');
    wrapper.unmount();
  });

  it('renders drag handle when handle prop is true', () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, handle: true },
      sync: false,
    });
    expect(wrapper.find('.xy-sortable-list').classes()).toContain('xy-sortable-list-with-handle');
    expect(wrapper.find('.xy-sortable-list-item-handle').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders empty state when model is empty', () => {
    const wrapper = mount(SortableList, {
      props: { model: [] },
      sync: false,
    });
    expect(wrapper.find('.xy-sortable-list-empty').exists()).toBe(true);
    expect(wrapper.findAll('.xy-sortable-list-item').length).toBe(0);
    wrapper.unmount();
  });

  it('renders default label from item.label', () => {
    const wrapper = mount(SortableList, {
      props: { model: [{ key: '1', label: '默认标签' }] },
      sync: false,
    });
    expect(wrapper.find('.xy-sortable-list-item-content').text()).toContain('默认标签');
    wrapper.unmount();
  });

  it('renders custom item via #item slot', () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems },
      slots: {
        item: ({ item }: { item: any }) => `自定义：${item.label}`,
      },
      sync: false,
    });
    const contents = wrapper.findAll('.xy-sortable-list-item-content');
    expect(contents[0].text()).toContain('自定义：列表项 1');
    wrapper.unmount();
  });

  it('marks item with disabled flag class', () => {
    const items = [
      { key: '1', label: '可拖拽' },
      { key: '2', label: '禁用项', disabled: true },
    ];
    const wrapper = mount(SortableList, {
      props: { model: items },
      sync: false,
    });
    const itemEls = wrapper.findAll('.xy-sortable-list-item');
    expect(itemEls[1].classes()).toContain('xy-sortable-list-item-disabled');
    wrapper.unmount();
  });

  it('marks SortableList with __XY_SORTABLE_LIST flag', () => {
    expect((SortableList as any).__XY_SORTABLE_LIST).toBe(true);
  });

  it('marks SortableItem with __XY_SORTABLE_ITEM flag', () => {
    expect((SortableItem as any).__XY_SORTABLE_ITEM).toBe(true);
  });

  it('default export has install function', () => {
    expect(typeof SortableListDefault.install).toBe('function');
  });

  it('named export SortableItem equals SortableItem component', () => {
    expect(SortableItemNamed).toBe(SortableItem);
  });

  it('uses custom itemKey field', () => {
    const items = [
      { id: 'a', text: '项 A' },
      { id: 'b', text: '项 B' },
    ];
    const wrapper = mount(SortableList, {
      props: { model: items, itemKey: 'id' },
      slots: {
        item: ({ item }: { item: any }) => item.text,
      },
      sync: false,
    });
    const contents = wrapper.findAll('.xy-sortable-list-item-content');
    expect(contents[0].text()).toBe('项 A');
    expect(contents[1].text()).toBe('项 B');
    wrapper.unmount();
  });

  // ===== a11y 测试 =====

  it('renders semantic roles: role="list" on root and role="listitem" on items', () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems },
      sync: false,
    });
    const root = wrapper.find('.xy-sortable-list');
    expect(root.attributes('role')).toBe('list');
    // 默认 aria-label
    expect(root.attributes('aria-label')).toBe('可排序列表');
    const items = wrapper.findAll('.xy-sortable-list-item');
    expect(items.length).toBe(3);
    items.forEach(it => {
      expect(it.attributes('role')).toBe('listitem');
    });
    wrapper.unmount();
  });

  it('supports custom ariaLabel on the list root', () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, ariaLabel: '我的可排序列表' },
      sync: false,
    });
    expect(wrapper.find('.xy-sortable-list').attributes('aria-label')).toBe('我的可排序列表');
    wrapper.unmount();
  });

  it('renders draggable handle with role=button, aria-label and tabindex', () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, handle: true },
      sync: false,
    });
    const handles = wrapper.findAll('.xy-sortable-list-item-handle');
    expect(handles.length).toBe(3);
    handles.forEach(h => {
      expect(h.attributes('role')).toBe('button');
      expect(h.attributes('aria-label')).toBe('拖拽排序');
      expect(h.attributes('tabindex')).toBe('0');
      // 默认未拾起时 aria-grabbed 为 false
      expect(h.attributes('aria-grabbed')).toBe('false');
    });
    wrapper.unmount();
  });

  it('marks disabled handle with tabindex=-1 and aria-disabled', () => {
    const items = [
      { key: '1', label: '可拖拽' },
      { key: '2', label: '禁用项', disabled: true },
    ];
    const wrapper = mount(SortableList, {
      props: { model: items, handle: true },
      sync: false,
    });
    const handles = wrapper.findAll('.xy-sortable-list-item-handle');
    expect(handles[0].attributes('tabindex')).toBe('0');
    expect(handles[1].attributes('tabindex')).toBe('-1');
    expect(handles[1].attributes('aria-disabled')).toBe('true');
    wrapper.unmount();
  });

  it('keyboard: Space picks up item and ArrowDown moves it down, then Space drops', async () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, handle: true },
      sync: false,
    });

    let items = wrapper.findAll('.xy-sortable-list-item');
    expect(items[0].find('.xy-sortable-list-item-content').text()).toContain('列表项 1');

    // 在第一项的拖拽手柄上按 Space 拾起
    const firstHandle = items[0].find('.xy-sortable-list-item-handle');
    await firstHandle.trigger('keydown', { key: ' ' });

    // 拾起后，第一项应该有 aria-grabbed="true" 与 keyboard-grabbed 类
    items = wrapper.findAll('.xy-sortable-list-item');
    expect(items[0].classes()).toContain('xy-sortable-list-item-keyboard-grabbed');
    expect(items[0].find('.xy-sortable-list-item-handle').attributes('aria-grabbed')).toBe('true');

    // 按 ArrowDown 应将第一项移动到第二位
    await firstHandle.trigger('keydown', { key: 'ArrowDown' });

    items = wrapper.findAll('.xy-sortable-list-item');
    // 现在"列表项 2"应在第一项的位置
    expect(items[0].find('.xy-sortable-list-item-content').text()).toContain('列表项 2');
    expect(items[1].find('.xy-sortable-list-item-content').text()).toContain('列表项 1');

    // 按 ArrowUp 应将项移回原位置
    // 注意：拾起后键盘焦点应跟随着被拾起的项，但 JSDOM 中焦点不会自动切换；
    // 仍向原 handle 触发键盘事件。这里我们改用 document.activeElement 的方式不太可行，
    // 因为 jsdom 不会自动移动焦点。我们直接在新位置的 handle 上触发 ArrowUp。
    const movedHandle = items[1].find('.xy-sortable-list-item-handle');
    await movedHandle.trigger('keydown', { key: 'ArrowUp' });

    items = wrapper.findAll('.xy-sortable-list-item');
    expect(items[0].find('.xy-sortable-list-item-content').text()).toContain('列表项 1');
    expect(items[1].find('.xy-sortable-list-item-content').text()).toContain('列表项 2');

    // 按 Space 放下当前项
    await movedHandle.trigger('keydown', { key: ' ' });
    items = wrapper.findAll('.xy-sortable-list-item');
    // 放下后不再有 keyboard-grabbed 类
    items.forEach(it => {
      expect(it.classes()).not.toContain('xy-sortable-list-item-keyboard-grabbed');
    });

    wrapper.unmount();
  });

  it('keyboard: Escape cancels drag and restores original order', async () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, handle: true },
      sync: false,
    });

    // 在第一项手柄上按 Space 拾起
    let items = wrapper.findAll('.xy-sortable-list-item');
    const firstHandle = items[0].find('.xy-sortable-list-item-handle');
    await firstHandle.trigger('keydown', { key: ' ' });

    // 按 ArrowDown 移动一次
    await firstHandle.trigger('keydown', { key: 'ArrowDown' });
    items = wrapper.findAll('.xy-sortable-list-item');
    expect(items[0].find('.xy-sortable-list-item-content').text()).toContain('列表项 2');

    // 按 Escape 取消，应恢复原始顺序
    await firstHandle.trigger('keydown', { key: 'Escape' });
    items = wrapper.findAll('.xy-sortable-list-item');
    expect(items[0].find('.xy-sortable-list-item-content').text()).toContain('列表项 1');
    expect(items[1].find('.xy-sortable-list-item-content').text()).toContain('列表项 2');
    expect(items[2].find('.xy-sortable-list-item-content').text()).toContain('列表项 3');
    // 取消后不再有 keyboard-grabbed 类
    items.forEach(it => {
      expect(it.classes()).not.toContain('xy-sortable-list-item-keyboard-grabbed');
    });

    wrapper.unmount();
  });

  it('keyboard: Home and End move item to the list bounds', async () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, handle: true },
      sync: false,
    });

    // 拾起中间项（索引 1，即"列表项 2"）
    let items = wrapper.findAll('.xy-sortable-list-item');
    const middleHandle = items[1].find('.xy-sortable-list-item-handle');
    await middleHandle.trigger('keydown', { key: ' ' });

    // 按 End 应将其移到列表末尾
    await middleHandle.trigger('keydown', { key: 'End' });
    items = wrapper.findAll('.xy-sortable-list-item');
    expect(items[2].find('.xy-sortable-list-item-content').text()).toContain('列表项 2');

    // 在新位置触发 Home 应将其移到列表首位
    const movedHandle = items[2].find('.xy-sortable-list-item-handle');
    await movedHandle.trigger('keydown', { key: 'Home' });
    items = wrapper.findAll('.xy-sortable-list-item');
    expect(items[0].find('.xy-sortable-list-item-content').text()).toContain('列表项 2');

    // 用 Esc 取消以恢复原顺序，避免影响后续测试
    await movedHandle.trigger('keydown', { key: 'Escape' });
    wrapper.unmount();
  });

  it('keyboard: aria-live region updates with drag status messages', async () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, handle: true },
      sync: false,
    });

    // 拾起前 live 区域应为空
    let live = wrapper.find('.xy-sortable-list-sr-only');
    expect(live.exists()).toBe(true);
    expect(live.text()).toBe('');

    // 拾起第一项
    const firstHandle = wrapper.findAll('.xy-sortable-list-item-handle')[0];
    await firstHandle.trigger('keydown', { key: ' ' });
    await wrapper.vm.$nextTick();

    live = wrapper.find('.xy-sortable-list-sr-only');
    expect(live.text()).toContain('已拾起');

    // 移动一次
    await firstHandle.trigger('keydown', { key: 'ArrowDown' });
    await wrapper.vm.$nextTick();
    live = wrapper.find('.xy-sortable-list-sr-only');
    expect(live.text()).toContain('正在移动');

    // 取消
    await firstHandle.trigger('keydown', { key: 'Escape' });
    await wrapper.vm.$nextTick();
    live = wrapper.find('.xy-sortable-list-sr-only');
    expect(live.text()).toContain('已取消');

    wrapper.unmount();
  });

  it('renders no handle role when handle=false but listitem has tabindex for keyboard', () => {
    const wrapper = mount(SortableList, {
      props: { model: basicItems, handle: false },
      sync: false,
    });
    const items = wrapper.findAll('.xy-sortable-list-item');
    expect(items.length).toBe(3);
    items.forEach(it => {
      expect(it.attributes('role')).toBe('listitem');
      expect(it.attributes('tabindex')).toBe('0');
      // 无 handle 模式下，listitem 自身承担交互语义
      expect(it.attributes('aria-roledescription')).toBe('可拖拽项');
    });
    // 不应渲染独立 handle
    expect(wrapper.findAll('.xy-sortable-list-item-handle').length).toBe(0);
    wrapper.unmount();
  });
});
