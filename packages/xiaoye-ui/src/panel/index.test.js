import { mount } from '@vue/test-utils';
import Panel from '.';
import mountTest from '../../tests/shared/mountTest';

describe('Panel', () => {
  mountTest(Panel);

  it('renders with default bordered class and title', () => {
    const wrapper = mount(Panel, {
      props: { title: 'Panel Title' },
      slots: { default: '<p>Panel content</p>' },
    });
    expect(wrapper.find('.xy-panel').exists()).toBe(true);
    expect(wrapper.find('.xy-panel').classes()).toContain('xy-panel-bordered');
    expect(wrapper.find('.xy-panel-head-title').text()).toBe('Panel Title');
    expect(wrapper.find('.xy-panel-body').text()).toBe('Panel content');
    wrapper.unmount();
  });

  it('removes the border class when bordered is false', () => {
    const wrapper = mount(Panel, {
      props: { bordered: false },
    });
    expect(wrapper.find('.xy-panel').classes()).not.toContain('xy-panel-bordered');
    wrapper.unmount();
  });

  it('renders hoverable and loading states', () => {
    const wrapper = mount(Panel, {
      props: { hoverable: true, loading: true },
    });
    expect(wrapper.find('.xy-panel').classes()).toContain('xy-panel-hoverable');
    expect(wrapper.find('.xy-panel').classes()).toContain('xy-panel-loading');
    expect(wrapper.find('.xy-panel-loading').exists()).toBe(true);
    expect(wrapper.findAll('.xy-panel-loading-block').length).toBe(3);
    wrapper.unmount();
  });

  it('renders footer and icons slots', () => {
    const wrapper = mount(Panel, {
      slots: {
        icons: '<span>Icon</span>',
        default: 'Content',
        footer: 'Footer',
      },
    });
    expect(wrapper.find('.xy-panel-head-actions').text()).toBe('Icon');
    expect(wrapper.find('.xy-panel-footer').text()).toBe('Footer');
    wrapper.unmount();
  });

  it('header slot takes precedence over title prop', () => {
    const wrapper = mount(Panel, {
      props: { title: 'Ignored' },
      slots: {
        header: 'Custom Header',
        default: 'Content',
      },
    });
    expect(wrapper.find('.xy-panel-head-title').text()).toBe('Custom Header');
    wrapper.unmount();
  });

  it('toggles content when toggleable is clicked', async () => {
    const wrapper = mount(Panel, {
      props: { title: 'Toggleable', toggleable: true },
      slots: { default: '<p>Panel content</p>' },
    });
    // jsdom 下 isVisible() 对 inline display 不可靠，直接用 element.style.display 断言
    expect(wrapper.find('.xy-panel-body').element.style.display).not.toBe('none');
    expect(wrapper.find('.xy-panel-toggle-button').exists()).toBe(true);
    expect(wrapper.find('.xy-panel-toggle-button').attributes('aria-expanded')).toBe('true');

    await wrapper.find('.xy-panel-toggle-button').trigger('click');

    expect(wrapper.find('.xy-panel-body').element.style.display).toBe('none');
    expect(wrapper.find('.xy-panel').classes()).toContain('xy-panel-collapsed');
    expect(wrapper.find('.xy-panel-toggle-button').attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('.xy-panel-toggle-icon-collapsed').exists()).toBe(true);
    wrapper.unmount();
  });

  it('supports v-model:collapsed', async () => {
    const wrapper = mount(Panel, {
      props: {
        title: 'Controlled',
        toggleable: true,
        collapsed: true,
        'onUpdate:collapsed': value => wrapper.setProps({ collapsed: value }),
      },
      slots: { default: '<p>Panel content</p>' },
    });
    expect(wrapper.find('.xy-panel-body').element.style.display).toBe('none');

    await wrapper.find('.xy-panel-toggle-button').trigger('click');

    expect(wrapper.emitted('update:collapsed')).toHaveLength(1);
    expect(wrapper.emitted('update:collapsed')[0]).toEqual([false]);
    expect(wrapper.emitted('toggle')).toHaveLength(1);
    expect(wrapper.emitted('toggle')[0][0].value).toBe(false);
    wrapper.unmount();
  });

  it('marks with __XY_PANEL flag', () => {
    expect(Panel.__XY_PANEL).toBe(true);
  });

  it('has install function', () => {
    expect(typeof Panel.install).toBe('function');
  });

  it('未启用 toggleable 时不渲染 toggle 按钮', () => {
    const wrapper = mount(Panel, {
      props: { title: 'Title' },
      slots: { default: '<p>content</p>' },
    });
    expect(wrapper.find('.xy-panel-toggle-button').exists()).toBe(false);
    wrapper.unmount();
  });

  it('支持 title 插槽渲染标题内容', () => {
    const wrapper = mount(Panel, {
      slots: {
        title: '<span class="custom-title">Slot Title</span>',
        default: 'Content',
      },
    });
    expect(wrapper.find('.xy-panel-head-title').exists()).toBe(true);
    expect(wrapper.find('.xy-panel-head-title .custom-title').exists()).toBe(true);
    expect(wrapper.find('.xy-panel-head-title').text()).toBe('Slot Title');
    wrapper.unmount();
  });

  it('collapsed 为 true 时 body 隐藏且 footer 不渲染', () => {
    const wrapper = mount(Panel, {
      props: { title: 'Collapsed', toggleable: true, collapsed: true },
      slots: {
        default: '<p>content</p>',
        footer: 'Footer',
      },
    });
    expect(wrapper.find('.xy-panel-body').element.style.display).toBe('none');
    expect(wrapper.find('.xy-panel-footer').exists()).toBe(false);
    wrapper.unmount();
  });

  it('icons 插槽与 toggleable 按钮共存于 head-actions', () => {
    const wrapper = mount(Panel, {
      props: { title: 'Title', toggleable: true },
      slots: {
        icons: '<span class="custom-icon">Icon</span>',
        default: 'Content',
      },
    });
    const actions = wrapper.find('.xy-panel-head-actions');
    expect(actions.exists()).toBe(true);
    expect(actions.find('.custom-icon').exists()).toBe(true);
    expect(actions.find('.xy-panel-toggle-button').exists()).toBe(true);
    wrapper.unmount();
  });

  it('未受控模式下 toggle 事件 payload 包含 originalEvent 和 value', async () => {
    const wrapper = mount(Panel, {
      props: { title: 'Toggleable', toggleable: true },
      slots: { default: '<p>content</p>' },
    });
    await wrapper.find('.xy-panel-toggle-button').trigger('click');
    const toggleEvents = wrapper.emitted('toggle');
    expect(toggleEvents).toBeTruthy();
    expect(toggleEvents[0][0]).toHaveProperty('originalEvent');
    expect(toggleEvents[0][0]).toHaveProperty('value', true);
    wrapper.unmount();
  });
});
