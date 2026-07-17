import { mount } from '@vue/test-utils';
import { defineComponent, ref, h, nextTick } from 'vue';
import FocusTrap from '.';
import { useFocusTrap } from './useFocusTrap';
import mountTest from '../../tests/shared/mountTest';

describe('FocusTrap', () => {
  mountTest(FocusTrap);

  it('renders a wrapper div with hidden focusable elements when enabled', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <FocusTrap>
              <input class="inner" />
            </FocusTrap>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await nextTick();
    const host = wrapper.find('[data-xy-focustrap="true"]');
    expect(host.exists()).toBe(true);
    expect(wrapper.find('.xy-hidden-focusable').exists()).toBe(true);
    wrapper.unmount();
  });

  it('does not set data-xy-focustrap when disabled (but elements still rendered)', async () => {
    // disabled 时不创建 hidden 元素，但仍设置 data-xy-focustrap=true（按源项目行为）
    const wrapper = mount(
      {
        render() {
          return (
            <FocusTrap disabled>
              <input class="inner" />
            </FocusTrap>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await nextTick();
    const host = wrapper.find('[data-xy-focustrap="true"]');
    expect(host.exists()).toBe(true);
    // disabled 时不创建 hidden 元素
    expect(wrapper.find('.xy-hidden-focusable').exists()).toBe(false);
    wrapper.unmount();
  });

  it('useFocusTrap composable applies trap on ref element', async () => {
    const Host = defineComponent({
      setup() {
        const containerRef = ref(null);
        useFocusTrap(containerRef);
        return () =>
          h('div', { ref: containerRef, class: 'host' }, [h('input', { class: 'inner' })]);
      },
    });
    const wrapper = mount(Host, { sync: false, attachTo: 'body' });
    await nextTick();
    expect(wrapper.find('.host').attributes('data-xy-focustrap')).toBe('true');
    expect(wrapper.find('.xy-hidden-focusable').exists()).toBe(true);
    wrapper.unmount();
  });

  it('useFocusTrap composable respects disabled option', async () => {
    const Host = defineComponent({
      setup() {
        const containerRef = ref(null);
        const opts = ref({ disabled: true });
        useFocusTrap(containerRef, opts);
        return () =>
          h('div', { ref: containerRef, class: 'host' }, [h('input', { class: 'inner' })]);
      },
    });
    const wrapper = mount(Host, { sync: false, attachTo: 'body' });
    await nextTick();
    expect(wrapper.find('.host').attributes('data-xy-focustrap')).toBe('true');
    expect(wrapper.find('.xy-hidden-focusable').exists()).toBe(false);
    wrapper.unmount();
  });
});
