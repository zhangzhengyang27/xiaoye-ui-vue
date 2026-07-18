import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach } from 'vitest';
import MegaMenu from '..';
import type { MegaMenuItem } from '../megaMenuTypes';
import mountTest from '../../../tests/shared/mountTest';

// 测试用菜单数据
const model: MegaMenuItem[] = [
  {
    key: 'videos',
    label: '视频',
    icon: 'pi pi-video',
    items: [
      [
        {
          label: '视频分类 1',
          items: [
            { key: 'v1-1', label: '视频 1.1' },
            { key: 'v1-2', label: '视频 1.2' },
          ],
        },
        {
          label: '视频分类 2',
          items: [
            { key: 'v2-1', label: '视频 2.1' },
            { key: 'v2-2', label: '视频 2.2' },
          ],
        },
      ],
    ],
  },
  {
    key: 'users',
    label: '用户',
    items: [
      [
        {
          label: '用户分组 1',
          items: [{ key: 'u1-1', label: '用户 1.1' }],
        },
      ],
      [
        {
          label: '用户分组 2',
          items: [{ key: 'u2-1', label: '用户 2.1' }],
        },
      ],
    ],
  },
  {
    key: 'settings',
    label: '设置',
  },
  {
    key: 'disabled-item',
    label: '禁用项',
    disabled: true,
  },
];

describe('MegaMenu', () => {
  mountTest(MegaMenu);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('marks with __XY_MEGA_MENU flag', () => {
    expect((MegaMenu as any).__XY_MEGA_MENU).toBe(true);
  });

  it('has install function', () => {
    expect(typeof MegaMenu.install).toBe('function');
  });

  it('renders root with xy-mega-menu class', () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    expect(wrapper.find('.xy-mega-menu').exists()).toBe(true);
    expect(wrapper.find('.xy-mega-menu-root-list').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders all top-level items', () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    // 4 个顶级项（含禁用项）
    expect(wrapper.findAll('.xy-mega-menu-root-list > .xy-mega-menu-item').length).toBe(4);
    wrapper.unmount();
  });

  it('renders top-level item labels', () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    const labels = wrapper.findAll(
      '.xy-mega-menu-root-list > .xy-mega-menu-item > .xy-mega-menu-item-content .xy-mega-menu-item-label',
    );
    expect(labels[0].text()).toBe('视频');
    expect(labels[1].text()).toBe('用户');
    expect(labels[2].text()).toBe('设置');
    wrapper.unmount();
  });

  it('applies horizontal class by default', () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    expect(wrapper.find('.xy-mega-menu-horizontal').exists()).toBe(true);
    expect(wrapper.find('.xy-mega-menu-vertical').exists()).toBe(false);
    wrapper.unmount();
  });

  it('applies vertical class when orientation is vertical', () => {
    const wrapper = mount(MegaMenu, {
      props: { model, orientation: 'vertical' },
    });
    expect(wrapper.find('.xy-mega-menu-vertical').exists()).toBe(true);
    expect(wrapper.find('.xy-mega-menu-horizontal').exists()).toBe(false);
    wrapper.unmount();
  });

  it('expands submenu panel on hover', async () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    // 初始状态下没有激活项
    expect(wrapper.find('.xy-mega-menu-item-active').exists()).toBe(false);

    // hover 第一个顶级项
    await wrapper
      .findAll('.xy-mega-menu-root-list > .xy-mega-menu-item')[0]
      .find('.xy-mega-menu-item-content')
      .trigger('mouseenter');

    expect(wrapper.findAll('.xy-mega-menu-item-active').length).toBe(1);
    // 子菜单面板应显示
    expect(wrapper.find('.xy-mega-menu-overlay').exists()).toBe(true);
    // 子菜单分组标题应存在
    expect(wrapper.findAll('.xy-mega-menu-submenu-label').length).toBeGreaterThanOrEqual(2);
    wrapper.unmount();
  });

  it('toggles active state on root item click', async () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    const firstItem = wrapper.findAll('.xy-mega-menu-root-list > .xy-mega-menu-item')[0];
    const content = firstItem.find('.xy-mega-menu-item-content');

    // 第一次点击：展开
    await content.trigger('click');
    expect(firstItem.classes()).toContain('xy-mega-menu-item-active');

    // 第二次点击：收起
    await content.trigger('click');
    expect(firstItem.classes()).not.toContain('xy-mega-menu-item-active');
    wrapper.unmount();
  });

  it('emits itemClick when clicking a leaf root item', async () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    // "设置" 是叶子项（无 items）
    const leafItem = wrapper.findAll('.xy-mega-menu-root-list > .xy-mega-menu-item')[2];
    await leafItem.find('.xy-mega-menu-item-content').trigger('click');

    const events = wrapper.emitted('itemClick');
    expect(events).toBeTruthy();
    expect(events![0][0]).toMatchObject({ key: 'settings' });
    wrapper.unmount();
  });

  it('emits itemClick when clicking a submenu leaf item', async () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
      attachTo: 'body',
    });
    // 先展开第一个顶级项
    await wrapper
      .findAll('.xy-mega-menu-root-list > .xy-mega-menu-item')[0]
      .find('.xy-mega-menu-item-content')
      .trigger('click');

    // 点击子菜单项
    const subItems = wrapper.findAll('.xy-mega-menu-overlay .xy-mega-menu-item');
    expect(subItems.length).toBeGreaterThan(0);
    await subItems[0].find('.xy-mega-menu-item-content').trigger('click');

    const events = wrapper.emitted('itemClick');
    expect(events).toBeTruthy();
    expect((events![0][0] as any).key).toBe('v1-1');
    wrapper.unmount();
  });

  it('marks disabled item with disabled class', () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    const disabledItem = wrapper.findAll('.xy-mega-menu-root-list > .xy-mega-menu-item')[3];
    expect(disabledItem.classes()).toContain('xy-mega-menu-item-disabled');
    wrapper.unmount();
  });

  it('does not toggle disabled item on click', async () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    const disabledItem = wrapper.findAll('.xy-mega-menu-root-list > .xy-mega-menu-item')[3];
    await disabledItem.find('.xy-mega-menu-item-content').trigger('click');
    expect(disabledItem.classes()).not.toContain('xy-mega-menu-item-active');
    wrapper.unmount();
  });

  it('respects controlled activeItem prop', () => {
    const wrapper = mount(MegaMenu, {
      props: { model, activeItem: 'users' },
    });
    const items = wrapper.findAll('.xy-mega-menu-root-list > .xy-mega-menu-item');
    expect(items[0].classes()).not.toContain('xy-mega-menu-item-active');
    expect(items[1].classes()).toContain('xy-mega-menu-item-active');
    wrapper.unmount();
  });

  it('emits update:activeItem on toggle', async () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    const firstItem = wrapper.findAll('.xy-mega-menu-root-list > .xy-mega-menu-item')[0];
    await firstItem.find('.xy-mega-menu-item-content').trigger('click');

    const updateEvents = wrapper.emitted('update:activeItem');
    expect(updateEvents).toBeTruthy();
    expect(updateEvents![0][0]).toBe('videos');
    wrapper.unmount();
  });

  it('renders start and end slots', () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
      slots: {
        start: '<div class="start-content">头部</div>',
        end: '<div class="end-content">尾部</div>',
      },
    });
    expect(wrapper.find('.xy-mega-menu-start .start-content').exists()).toBe(true);
    expect(wrapper.find('.xy-mega-menu-end .end-content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders column grid for multi-column submenu', async () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
    });
    // users 有 2 列
    await wrapper
      .findAll('.xy-mega-menu-root-list > .xy-mega-menu-item')[1]
      .find('.xy-mega-menu-item-content')
      .trigger('click');

    // 应有 2 列（只查找激活项的 overlay）
    const columns = wrapper.findAll(
      '.xy-mega-menu-item-active > .xy-mega-menu-overlay .xy-mega-menu-column',
    );
    expect(columns.length).toBe(2);
    // 2 列对应 column-6 宽度类
    expect(columns[0].classes()).toContain('xy-mega-menu-column-6');
    wrapper.unmount();
  });

  it('closes panel on outside click', async () => {
    const wrapper = mount(MegaMenu, {
      props: { model },
      attachTo: 'body',
    });
    // 展开
    await wrapper
      .findAll('.xy-mega-menu-root-list > .xy-mega-menu-item')[0]
      .find('.xy-mega-menu-item-content')
      .trigger('click');
    expect(wrapper.findAll('.xy-mega-menu-item-active').length).toBe(1);

    // 外部点击
    const external = document.createElement('div');
    document.body.appendChild(external);
    const event = new MouseEvent('click', { bubbles: true });
    external.dispatchEvent(event);
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.xy-mega-menu-item-active').length).toBe(0);
    wrapper.unmount();
  });

  it('renders nothing when model is empty', () => {
    const wrapper = mount(MegaMenu, {
      props: { model: [] },
    });
    expect(wrapper.findAll('.xy-mega-menu-item').length).toBe(0);
    wrapper.unmount();
  });
});
