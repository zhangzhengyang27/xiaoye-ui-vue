import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import KeyFilter from '../index';

describe('KeyFilter', () => {
  it('has correct name and flag', () => {
    expect(KeyFilter.name).toBe('XYKeyFilter');
    expect(KeyFilter.__XY_KEY_FILTER).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof KeyFilter.install).toBe('function');
  });

  it('mounts on an input element and marks it', async () => {
    const wrapper = mount(KeyFilter, {
      slots: {
        default: '<input />',
      },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.attributes('data-xy-keyfilter')).toBe('true');
    expect(input.attributes('autocomplete')).toBe('off');
    wrapper.unmount();
  });

  it('blocks non-digit keys in pint preset', async () => {
    const wrapper = mount(KeyFilter, {
      props: { preset: 'pint' },
      slots: {
        default: '<input />',
      },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find('input').element;
    const allowedEvent = new KeyboardEvent('keypress', {
      key: '5',
      bubbles: true,
      cancelable: true,
    });
    const blockedEvent = new KeyboardEvent('keypress', {
      key: 'a',
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(allowedEvent);
    expect(allowedEvent.defaultPrevented).toBe(false);

    input.dispatchEvent(blockedEvent);
    expect(blockedEvent.defaultPrevented).toBe(true);
    wrapper.unmount();
  });

  it('allows input matching a custom regex pattern', async () => {
    const wrapper = mount(KeyFilter, {
      props: { pattern: /[A-Z]/ },
      slots: {
        default: '<input />',
      },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find('input').element;
    const allowedEvent = new KeyboardEvent('keypress', {
      key: 'A',
      bubbles: true,
      cancelable: true,
    });
    const blockedEvent = new KeyboardEvent('keypress', {
      key: 'a',
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(allowedEvent);
    expect(allowedEvent.defaultPrevented).toBe(false);

    input.dispatchEvent(blockedEvent);
    expect(blockedEvent.defaultPrevented).toBe(true);
    wrapper.unmount();
  });

  it('filters pasted characters that do not match the pattern', async () => {
    const wrapper = mount(KeyFilter, {
      props: { preset: 'pint' },
      slots: {
        default: '<input />',
      },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find('input').element;
    const pasteEvent = new Event('paste', {
      bubbles: true,
      cancelable: true,
    });
    pasteEvent.clipboardData = {
      getData: () => 'abc',
    };

    input.dispatchEvent(pasteEvent);
    expect(pasteEvent.defaultPrevented).toBe(true);
    wrapper.unmount();
  });

  it('validates the whole value when validateOnly is true', async () => {
    const wrapper = mount(KeyFilter, {
      props: { pattern: /^\d+$/, validateOnly: true },
      slots: {
        default: '<input />',
      },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find('input').element;

    input.value = '12';

    const allowedEvent = new KeyboardEvent('keypress', {
      key: '3',
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(allowedEvent);
    expect(allowedEvent.defaultPrevented).toBe(false);

    const blockedEvent = new KeyboardEvent('keypress', {
      key: 'a',
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(blockedEvent);
    expect(blockedEvent.defaultPrevented).toBe(true);
    wrapper.unmount();
  });
});
