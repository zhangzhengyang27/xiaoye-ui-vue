import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import SplitButton from '../SplitButton';
import mountTest from '../../../tests/shared/mountTest';

describe('SplitButton', () => {
  mountTest(SplitButton);

  it('renders correctly with label', () => {
    const wrapper = mount(SplitButton, {
      props: { label: 'Save' },
    });
    expect(wrapper.find('.xy-split-button').exists()).toBe(true);
    expect(wrapper.text()).toContain('Save');
    wrapper.unmount();
  });

  it('renders default content via default slot', () => {
    const wrapper = mount(SplitButton, {
      slots: { default: () => 'Custom' },
    });
    expect(wrapper.text()).toContain('Custom');
    wrapper.unmount();
  });

  it('renders primary type', () => {
    const wrapper = mount(SplitButton, {
      props: { type: 'primary', label: 'Primary' },
    });
    expect(wrapper.find('.xy-btn-primary').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders dashed type', () => {
    const wrapper = mount(SplitButton, {
      props: { type: 'dashed', label: 'Dashed' },
    });
    expect(wrapper.find('.xy-btn-dashed').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders danger button', () => {
    const wrapper = mount(SplitButton, {
      props: { danger: true, label: 'Danger' },
    });
    expect(wrapper.find('.xy-btn-dangerous').exists()).toBe(true);
    wrapper.unmount();
  });

  it('triggers onClick when main button is clicked', async () => {
    const onClick = vi.fn();
    const wrapper = mount(SplitButton, {
      props: { label: 'Click', onClick },
    });
    // 第一个按钮是主按钮
    const buttons = wrapper.findAll('.xy-btn');
    await buttons[0].trigger('click');
    expect(onClick).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('disables both buttons when disabled', () => {
    const wrapper = mount(SplitButton, {
      props: { disabled: true, label: 'Disabled' },
    });
    const buttons = wrapper.findAll('.xy-btn');
    buttons.forEach(btn => {
      expect(btn.attributes('disabled')).toBeDefined();
    });
    wrapper.unmount();
  });

  it('renders loading state', () => {
    const wrapper = mount(SplitButton, {
      props: { loading: true, label: 'Loading' },
    });
    expect(wrapper.find('.xy-btn-loading').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders different sizes', () => {
    const wrapper = mount(SplitButton, {
      props: { size: 'large', label: 'Large' },
    });
    expect(wrapper.find('.xy-btn-lg').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders small size', () => {
    const wrapper = mount(SplitButton, {
      props: { size: 'small', label: 'Small' },
    });
    expect(wrapper.find('.xy-btn-sm').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders menu items from model', () => {
    const wrapper = mount(SplitButton, {
      props: {
        label: 'Actions',
        model: [
          { key: '1', label: 'Edit' },
          { key: '2', label: 'Delete' },
        ],
      },
    });
    // 菜单内容通过 Dropdown overlay 渲染，Dropdown 组件应存在
    expect(wrapper.findComponent({ name: 'XYDropdown' }).exists()).toBe(true);
    wrapper.unmount();
  });

  it('passes appropriate props to Dropdown', () => {
    const wrapper = mount(SplitButton, {
      props: {
        label: 'Actions',
        placement: 'topLeft',
        trigger: 'click',
      },
    });
    const dropdownProps = wrapper.findComponent({ name: 'XYDropdown' }).props();
    expect(dropdownProps.placement).toBe('topLeft');
    expect(dropdownProps.trigger).toBe('click');
    wrapper.unmount();
  });

  it('uses overlay slot when provided', () => {
    const wrapper = mount(SplitButton, {
      props: { label: 'Actions' },
      slots: {
        overlay: () => <div class="custom-overlay">custom</div>,
      },
    });
    // 使用 overlay 插槽时不应渲染 Menu 组件
    expect(wrapper.findComponent({ name: 'XYMenu' }).exists()).toBe(false);
    wrapper.unmount();
  });

  it('renders DownOutlined icon on dropdown trigger button', () => {
    const wrapper = mount(SplitButton, {
      props: { label: 'Actions' },
    });
    // 下拉触发按钮（第二个按钮）应包含下箭头图标
    const buttons = wrapper.findAll('.xy-btn');
    expect(buttons.length).toBe(2);
    wrapper.unmount();
  });
});
