import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Fieldset from '.';
import mountTest from '../../tests/shared/mountTest';

describe('Fieldset', () => {
  mountTest(Fieldset);

  it('renders basic fieldset with legend', () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header' },
      slots: { default: '<p>content</p>' },
    });
    expect(wrapper.find('.xy-fieldset').exists()).toBe(true);
    expect(wrapper.find('.xy-fieldset-legend').exists()).toBe(true);
    expect(wrapper.find('.xy-fieldset-legend-label').text()).toBe('Header');
    expect(wrapper.find('.xy-fieldset-content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders toggle button when toggleable', () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header', toggleable: true },
    });
    expect(wrapper.find('.xy-fieldset-toggleable').exists()).toBe(true);
    expect(wrapper.find('.xy-fieldset-toggle-button').exists()).toBe(true);
    expect(wrapper.find('.xy-fieldset-toggle-icon').exists()).toBe(true);
    wrapper.unmount();
  });

  it('does not render toggle button when not toggleable', () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header', toggleable: false },
    });
    expect(wrapper.find('.xy-fieldset-toggle-button').exists()).toBe(false);
    wrapper.unmount();
  });

  it('toggles collapsed state on button click', async () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header', toggleable: true, collapsed: true },
    });
    await wrapper.find('.xy-fieldset-toggle-button').trigger('click');
    expect(wrapper.emitted('update:collapsed')).toBeTruthy();
    expect(wrapper.emitted('update:collapsed')[0]).toEqual([false]);
    expect(wrapper.emitted('toggle')).toBeTruthy();
    wrapper.unmount();
  });

  it('toggles collapsed state on Enter key', async () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header', toggleable: true, collapsed: true },
    });
    await wrapper.find('.xy-fieldset-toggle-button').trigger('keydown', { code: 'Enter' });
    expect(wrapper.emitted('update:collapsed')).toBeTruthy();
    wrapper.unmount();
  });

  it('toggles collapsed state on Space key', async () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header', toggleable: true, collapsed: false },
    });
    await wrapper.find('.xy-fieldset-toggle-button').trigger('keydown', { code: 'Space' });
    expect(wrapper.emitted('update:collapsed')[0]).toEqual([true]);
    wrapper.unmount();
  });

  it('marks with __XY_FIELDSET flag', () => {
    expect(Fieldset.__XY_FIELDSET).toBe(true);
  });

  it('exposes toggle and onKeyDown methods', () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header', toggleable: true },
    });
    expect(typeof wrapper.vm.toggle).toBe('function');
    expect(typeof wrapper.vm.onKeyDown).toBe('function');
    wrapper.unmount();
  });

  it('syncs internal state when props.collapsed changes', async () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header', toggleable: true, collapsed: true },
    });
    expect(wrapper.find('.xy-fieldset-toggle-button').attributes('aria-expanded')).toBe('false');
    await wrapper.setProps({ collapsed: false });
    expect(wrapper.find('.xy-fieldset-toggle-button').attributes('aria-expanded')).toBe('true');
    wrapper.unmount();
  });

  it('has install function', () => {
    expect(typeof Fieldset.install).toBe('function');
  });

  it('collapsed 为 true 时内容区域隐藏', () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header', toggleable: true, collapsed: true },
      slots: { default: '<p>content</p>' },
    });
    expect(wrapper.find('.xy-fieldset-content-container').element.style.display).toBe('none');
    wrapper.unmount();
  });

  it('支持 legend 插槽自定义渲染', () => {
    const wrapper = mount(Fieldset, {
      props: { toggleable: false },
      slots: {
        legend: '<span class="custom-legend">Custom Legend</span>',
        default: '<p>content</p>',
      },
    });
    expect(wrapper.find('.custom-legend').exists()).toBe(true);
    expect(wrapper.find('.custom-legend').text()).toBe('Custom Legend');
    // 使用插槽时不渲染默认 legend-label
    expect(wrapper.find('.xy-fieldset-legend-label').exists()).toBe(false);
    wrapper.unmount();
  });

  it('toggleicon 插槽接收 collapsed 状态参数', () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Header', toggleable: true, collapsed: true },
      slots: {
        toggleicon: ({ collapsed }) =>
          h('span', {
            class: ['custom-toggle-icon', collapsed ? 'is-collapsed' : 'is-expanded'],
          }),
      },
    });
    expect(wrapper.find('.custom-toggle-icon').exists()).toBe(true);
    expect(wrapper.find('.is-collapsed').exists()).toBe(true);
    wrapper.unmount();
  });

  it('toggleButtonProps 中的 aria-label 覆盖默认 legend 文案', () => {
    const wrapper = mount(Fieldset, {
      props: {
        legend: 'Default Legend',
        toggleable: true,
        toggleButtonProps: { 'aria-label': 'Expand section' },
      },
    });
    expect(wrapper.find('.xy-fieldset-toggle-button').attributes('aria-label')).toBe(
      'Expand section',
    );
    wrapper.unmount();
  });
});
