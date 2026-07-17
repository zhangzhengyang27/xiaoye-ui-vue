import { mount } from '@vue/test-utils';
import { defineComponent, ref, h, nextTick } from 'vue';
import Ripple from '.';
import { useRipple } from './useRipple';
import mountTest from '../../tests/shared/mountTest';

describe('Ripple', () => {
  mountTest(Ripple);

  it('renders a host span wrapping children when enabled', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Ripple>
              <button class="target">click me</button>
            </Ripple>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await nextTick();
    const host = wrapper.find('.xy-ripple');
    expect(host.exists()).toBe(true);
    expect(host.element.tagName).toBe('SPAN');
    expect(host.element.style.position).toBe('relative');
    expect(host.element.style.overflow).toBe('hidden');
    expect(host.find('.target').exists()).toBe(true);
    wrapper.unmount();
  });

  it('injects ink span into host', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Ripple>
              <button class="target">click me</button>
            </Ripple>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await nextTick();
    expect(wrapper.find('.xy-ripple__ink').exists()).toBe(true);
    wrapper.unmount();
  });

  it('does not apply ripple when disabled', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Ripple disabled>
              <button class="target">click me</button>
            </Ripple>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await nextTick();
    // disabled 时 host span 不应有 ripple 类与样式，ink 不存在
    expect(wrapper.find('.xy-ripple').exists()).toBe(false);
    expect(wrapper.find('.xy-ripple__ink').exists()).toBe(false);
    // 但子元素仍渲染
    expect(wrapper.find('.target').exists()).toBe(true);
    wrapper.unmount();
  });

  it('useRipple composable enables ripple on ref element', async () => {
    const Host = defineComponent({
      setup() {
        const btnRef = ref(null);
        useRipple(btnRef);
        return () => h('button', { ref: btnRef, class: 'target' }, 'click me');
      },
    });
    const wrapper = mount(Host, { sync: false, attachTo: 'body' });
    await nextTick();
    const target = wrapper.find('.target');
    expect(target.classes()).toContain('xy-ripple');
    expect(target.element.style.position).toBe('relative');
    expect(target.element.style.overflow).toBe('hidden');
    expect(wrapper.find('.xy-ripple__ink').exists()).toBe(true);
    wrapper.unmount();
  });

  it('useRipple composable respects enabled=false', async () => {
    const Host = defineComponent({
      setup() {
        const btnRef = ref(null);
        const enabled = ref(false);
        useRipple(btnRef, enabled);
        return () => h('button', { ref: btnRef, class: 'target' }, 'click me');
      },
    });
    const wrapper = mount(Host, { sync: false, attachTo: 'body' });
    await nextTick();
    expect(wrapper.find('.target').classes()).not.toContain('xy-ripple');
    expect(wrapper.find('.xy-ripple__ink').exists()).toBe(false);
    wrapper.unmount();
  });
});
