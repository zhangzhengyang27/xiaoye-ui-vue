import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach, vi } from 'vitest';
import PanelMenu from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('PanelMenu', () => {
  mountTest(PanelMenu);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // 标识与注册
  it('marks with __XY_PANEL_MENU flag', () => {
    expect((PanelMenu as any).__XY_PANEL_MENU).toBe(true);
  });

  it('has install function', () => {
    expect(typeof PanelMenu.install).toBe('function');
  });

  // 基础渲染
  it('renders root with xy-panel-menu class', () => {
    const wrapper = mount(PanelMenu, {
      props: {
        model: [{ key: '1', label: '文件' }],
      },
    });
    expect(wrapper.find('.xy-panel-menu').exists()).toBe(true);
    expect(wrapper.findAll('.xy-panel-menu-panel').length).toBe(1);
    expect(wrapper.find('.xy-panel-menu-header').text()).toContain('文件');
    wrapper.unmount();
  });

  // 不可见项不渲染
  it('hides items with visible=false', () => {
    const wrapper = mount(PanelMenu, {
      props: {
        model: [
          { key: '1', label: '可见' },
          { key: '2', label: '隐藏', visible: false },
        ],
      },
    });
    expect(wrapper.findAll('.xy-panel-menu-panel').length).toBe(1);
    expect(wrapper.find('.xy-panel-menu-header').text()).toContain('可见');
    wrapper.unmount();
  });

  // 点击头部展开 / 折叠
  it('toggles panel on header click', async () => {
    const wrapper = mount(PanelMenu, {
      props: {
        model: [
          {
            key: '1',
            label: '用户',
            items: [{ key: '1_0', label: '新增' }],
          },
        ],
      },
    });

    // 初始：内容容器 display:none
    expect(wrapper.find('.xy-panel-menu-content-container').attributes('style')).toContain(
      'display: none',
    );

    // 点击头部展开
    await wrapper.find('.xy-panel-menu-header').trigger('click');
    expect(wrapper.find('.xy-panel-menu-content-container').attributes('style')).toContain(
      'display: block',
    );

    // 再次点击折叠
    await wrapper.find('.xy-panel-menu-header').trigger('click');
    expect(wrapper.find('.xy-panel-menu-content-container').attributes('style')).toContain(
      'display: none',
    );
    wrapper.unmount();
  });

  // 受控 expandedKeys
  it('respects expandedKeys as controlled state', async () => {
    const wrapper = mount(PanelMenu, {
      props: {
        model: [
          {
            key: '1',
            label: '用户',
            items: [{ key: '1_0', label: '新增' }],
          },
        ],
        expandedKeys: { '1': true },
      },
    });

    expect(wrapper.find('.xy-panel-menu-content-container').attributes('style')).toContain(
      'display: block',
    );

    // 触发 update:expandedKeys
    await wrapper.find('.xy-panel-menu-header').trigger('click');
    expect(wrapper.emitted('update:expandedKeys')).toBeTruthy();
    const emittedPayload = wrapper.emitted('update:expandedKeys')![0][0] as Record<string, boolean>;
    expect(emittedPayload['1']).toBeUndefined();
    wrapper.unmount();
  });

  // expand / collapse 事件
  it('emits expand and collapse events', async () => {
    const wrapper = mount(PanelMenu, {
      props: {
        model: [
          {
            key: '1',
            label: '用户',
            items: [{ key: '1_0', label: '新增' }],
          },
        ],
      },
    });

    // 展开
    await wrapper.find('.xy-panel-menu-header').trigger('click');
    expect(wrapper.emitted('expand')).toBeTruthy();
    expect(wrapper.emitted('panel-open')).toBeTruthy();

    // 折叠
    await wrapper.find('.xy-panel-menu-header').trigger('click');
    expect(wrapper.emitted('collapse')).toBeTruthy();
    expect(wrapper.emitted('panel-close')).toBeTruthy();
    wrapper.unmount();
  });

  // 多选模式：multiple
  it('supports multiple expanded panels', async () => {
    const wrapper = mount(PanelMenu, {
      props: {
        multiple: true,
        model: [
          {
            key: '1',
            label: '用户',
            items: [{ key: '1_0', label: '新增' }],
          },
          {
            key: '2',
            label: '权限',
            items: [{ key: '2_0', label: '查看' }],
          },
        ],
      },
    });

    const headers = wrapper.findAll('.xy-panel-menu-header');
    await headers[0].trigger('click');
    await headers[1].trigger('click');

    const containers = wrapper.findAll('.xy-panel-menu-content-container');
    expect(containers[0].attributes('style')).toContain('display: block');
    expect(containers[1].attributes('style')).toContain('display: block');
    wrapper.unmount();
  });

  // 禁用项不响应点击
  it('does not toggle disabled panel', async () => {
    const wrapper = mount(PanelMenu, {
      props: {
        model: [
          {
            key: '1',
            label: '禁用',
            disabled: true,
            items: [{ key: '1_0', label: '子项' }],
          },
        ],
      },
    });

    expect(wrapper.find('.xy-panel-menu-header-disabled').exists()).toBe(true);
    await wrapper.find('.xy-panel-menu-header').trigger('click');
    expect(wrapper.emitted('expand')).toBeFalsy();
    wrapper.unmount();
  });

  // 嵌套子菜单渲染
  it('renders nested submenu items', async () => {
    const wrapper = mount(PanelMenu, {
      props: {
        expandedKeys: { '2': true, '2_2': true },
        model: [
          {
            key: '2',
            label: '用户',
            items: [
              { key: '2_0', label: '新增' },
              { key: '2_1', label: '删除' },
              {
                key: '2_2',
                label: '搜索',
                items: [{ key: '2_2_0', label: '过滤' }],
              },
            ],
          },
        ],
      },
    });

    // 顶层 + 子菜单中的 item（受 expandedKeys 控制可见性）
    const items = wrapper.findAll('.xy-panel-menu-item');
    expect(items.length).toBeGreaterThan(0);
    expect(wrapper.find('.xy-panel-menu-item-label').text()).toContain('新增');
    wrapper.unmount();
  });

  // 点击子项触发 itemClick
  it('emits itemClick when clicking submenu item', async () => {
    const onItemClick = vi.fn();
    const wrapper = mount(PanelMenu, {
      props: {
        expandedKeys: { '1': true },
        model: [
          {
            key: '1',
            label: '用户',
            items: [{ key: '1_0', label: '新增' }],
          },
        ],
        onItemClick,
      },
    });

    await wrapper.find('.xy-panel-menu-item-content').trigger('click');
    expect(wrapper.emitted('itemClick')).toBeTruthy();
    expect(onItemClick).toHaveBeenCalled();
    wrapper.unmount();
  });

  // command 回调
  it('invokes command callback on item click', async () => {
    const command = vi.fn();
    const wrapper = mount(PanelMenu, {
      props: {
        expandedKeys: { '1': true },
        model: [
          {
            key: '1',
            label: '用户',
            items: [{ key: '1_0', label: '新增', command }],
          },
        ],
      },
    });

    await wrapper.find('.xy-panel-menu-item-content').trigger('click');
    expect(command).toHaveBeenCalled();
    wrapper.unmount();
  });
});
