import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ref, nextTick } from 'vue';
import DarkModeToggle from '../DarkModeToggle';
import { useDarkMode } from '../useDarkMode';
import mountTest from '../../../tests/shared/mountTest';

describe('DarkModeToggle', () => {
  mountTest(DarkModeToggle);

  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders with default props (button variant)', () => {
    const wrapper = mount(DarkModeToggle);
    expect(wrapper.find('.xy-dark-mode-toggle').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').attributes('role')).toBe('switch');
    wrapper.unmount();
  });

  it('renders checked class when defaultDark is true', () => {
    const wrapper = mount(DarkModeToggle, {
      props: { defaultDark: true },
    });
    expect(wrapper.find('.xy-dark-mode-toggle-checked').exists()).toBe(true);
    wrapper.unmount();
  });

  it('toggles dark state on click', async () => {
    const wrapper = mount(DarkModeToggle);
    expect(wrapper.find('.xy-dark-mode-toggle-checked').exists()).toBe(false);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.xy-dark-mode-toggle-checked').exists()).toBe(true);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.xy-dark-mode-toggle-checked').exists()).toBe(false);
    wrapper.unmount();
  });

  it('emits change and update:dark events on click', async () => {
    const wrapper = mount(DarkModeToggle);
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('change')).toBeTruthy();
    expect(wrapper.emitted('change')![0]).toEqual([true]);
    expect(wrapper.emitted('update:dark')).toBeTruthy();
    expect(wrapper.emitted('update:dark')![0]).toEqual([true]);
    wrapper.unmount();
  });

  it('supports v-model:dark', async () => {
    const wrapper = mount({
      setup() {
        const dark = ref(false);
        return () => <DarkModeToggle v-model:dark={dark.value} applyToDocument={false} />;
      },
    });
    expect(wrapper.find('.xy-dark-mode-toggle-checked').exists()).toBe(false);
    await wrapper.find('button').trigger('click');
    await nextTick();
    expect(wrapper.find('.xy-dark-mode-toggle-checked').exists()).toBe(true);
    wrapper.unmount();
  });

  it('does not toggle when disabled', async () => {
    const wrapper = mount(DarkModeToggle, {
      props: { disabled: true },
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.xy-dark-mode-toggle-checked').exists()).toBe(false);
    expect(wrapper.emitted('change')).toBeFalsy();
    wrapper.unmount();
  });

  it('renders switch variant', () => {
    const wrapper = mount(DarkModeToggle, {
      props: { variant: 'switch' },
    });
    expect(wrapper.find('.xy-switch').exists()).toBe(true);
    wrapper.unmount();
  });

  it('switch variant toggles on click', async () => {
    const wrapper = mount(DarkModeToggle, {
      props: { variant: 'switch', applyToDocument: false },
    });
    expect(wrapper.find('.xy-switch-checked').exists()).toBe(false);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.xy-switch-checked').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders custom sun/moon icons from props', () => {
    const wrapper = mount(DarkModeToggle, {
      props: {
        defaultDark: false,
        sunIcon: () => <span class="custom-sun">sun</span>,
      },
    });
    expect(wrapper.find('.custom-sun').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders custom moon icon when dark', () => {
    const wrapper = mount(DarkModeToggle, {
      props: {
        defaultDark: true,
        moonIcon: () => <span class="custom-moon">moon</span>,
      },
    });
    expect(wrapper.find('.custom-moon').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders custom icons from slots', () => {
    const wrapper = mount(DarkModeToggle, {
      props: { defaultDark: false },
      slots: {
        sunIcon: () => <span class="slot-sun">sun</span>,
      },
    });
    expect(wrapper.find('.slot-sun').exists()).toBe(true);
    wrapper.unmount();
  });

  it('applies data-theme to document when applyToDocument is true', async () => {
    const wrapper = mount(DarkModeToggle, {
      props: { applyToDocument: true, defaultDark: false },
    });
    await nextTick();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    await wrapper.find('button').trigger('click');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    wrapper.unmount();
  });

  it('does not apply data-theme when applyToDocument is false', async () => {
    const wrapper = mount(DarkModeToggle, {
      props: { applyToDocument: false, defaultDark: false },
    });
    await nextTick();
    expect(document.documentElement.getAttribute('data-theme')).toBe(null);
    await wrapper.find('button').trigger('click');
    expect(document.documentElement.getAttribute('data-theme')).toBe(null);
    wrapper.unmount();
  });

  it('renders large and small size classes', () => {
    const largeWrapper = mount(DarkModeToggle, {
      props: { size: 'large' },
    });
    expect(largeWrapper.find('.xy-dark-mode-toggle-large').exists()).toBe(true);
    largeWrapper.unmount();

    const smallWrapper = mount(DarkModeToggle, {
      props: { size: 'small' },
    });
    expect(smallWrapper.find('.xy-dark-mode-toggle-small').exists()).toBe(true);
    smallWrapper.unmount();
  });

  it('exposes focus and blur methods', () => {
    const wrapper = mount(DarkModeToggle);
    const vm = wrapper.vm as any;
    expect(typeof vm.focus).toBe('function');
    expect(typeof vm.blur).toBe('function');
    wrapper.unmount();
  });
});

describe('useDarkMode', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('returns isDark, toggle, setDark', () => {
    const { isDark, toggle, setDark } = useDarkMode({
      applyToDocument: false,
    });
    expect(typeof isDark.value).toBe('boolean');
    expect(typeof toggle).toBe('function');
    expect(typeof setDark).toBe('function');
  });

  it('initial value works', () => {
    const { isDark } = useDarkMode({
      initialValue: true,
      applyToDocument: false,
    });
    expect(isDark.value).toBe(true);
  });

  it('setDark updates state', () => {
    const { isDark, setDark } = useDarkMode({
      initialValue: false,
      applyToDocument: false,
    });
    setDark(true);
    expect(isDark.value).toBe(true);
    setDark(false);
    expect(isDark.value).toBe(false);
  });

  it('toggle flips state', () => {
    const { isDark, toggle } = useDarkMode({
      initialValue: false,
      applyToDocument: false,
    });
    toggle();
    expect(isDark.value).toBe(true);
    toggle();
    expect(isDark.value).toBe(false);
  });

  it('applyToDocument syncs data-theme attribute', () => {
    const { setDark } = useDarkMode({
      initialValue: false,
      applyToDocument: true,
    });
    setDark(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    setDark(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
