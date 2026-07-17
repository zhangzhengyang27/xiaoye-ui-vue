import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import OverlayBadge from '../index';

describe('OverlayBadge', () => {
  it('has correct name and flag', () => {
    expect(OverlayBadge.name).toBe('XYOverlayBadge');
    expect(OverlayBadge.__XY_OVERLAY_BADGE).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof OverlayBadge.install).toBe('function');
  });

  it('renders root element with xy-overlay-badge class', () => {
    const wrapper = mount(OverlayBadge);
    expect(wrapper.find('.xy-overlay-badge').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders default slot content', () => {
    const wrapper = mount(OverlayBadge, {
      slots: {
        default: '<button>Click</button>',
      },
    });
    expect(wrapper.find('button').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders Badge with count from value prop', () => {
    const wrapper = mount(OverlayBadge, {
      props: { value: 5 },
      slots: {
        default: '<span>content</span>',
      },
    });
    // Badge 渲染的 ScrollNumber 包含 count
    expect(wrapper.text()).toContain('5');
    wrapper.unmount();
  });

  it('passes class and style through to root', () => {
    const wrapper = mount(OverlayBadge, {
      props: { class: 'custom-class', style: { color: 'red' } },
    });
    const root = wrapper.find('.xy-overlay-badge');
    expect(root.classes()).toContain('custom-class');
    expect(root.attributes('style')).toContain('color: red');
    wrapper.unmount();
  });
});
