import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MeterGroup from '../MeterGroup';

describe('MeterGroup', () => {
  const values = [
    { label: 'Apps', value: 20, color: '#3b82f6' },
    { label: 'Messages', value: 40, color: '#22c55e' },
    { label: 'Media', value: 30, color: '#f59e0b' },
  ];

  it('renders root and meters with prefix classes', () => {
    const wrapper = mount(MeterGroup, {
      props: { values },
    });

    expect(wrapper.classes()).toContain('xy-meter-group');
    expect(wrapper.classes()).toContain('xy-meter-group-horizontal');
    expect(wrapper.find('.xy-meter-group-meters').exists()).toBe(true);
    expect(wrapper.findAll('.xy-meter-group-meter').length).toBe(3);
  });

  it('applies vertical orientation modifier', () => {
    const wrapper = mount(MeterGroup, {
      props: { values, orientation: 'vertical' },
    });

    expect(wrapper.classes()).toContain('xy-meter-group-vertical');
  });

  it('renders label list with horizontal modifier by default', () => {
    const wrapper = mount(MeterGroup, {
      props: { values },
    });

    const list = wrapper.find('.xy-meter-group-label-list');
    expect(list.exists()).toBe(true);
    expect(list.classes()).toContain('xy-meter-group-label-list-horizontal');
    expect(wrapper.findAll('.xy-meter-group-label').length).toBe(3);
  });

  it('applies vertical label list modifier', () => {
    const wrapper = mount(MeterGroup, {
      props: { values, labelOrientation: 'vertical' },
    });

    expect(wrapper.find('.xy-meter-group-label-list').classes()).toContain(
      'xy-meter-group-label-list-vertical',
    );
  });

  it('renders label markers and text', () => {
    const wrapper = mount(MeterGroup, {
      props: { values },
    });

    expect(wrapper.findAll('.xy-meter-group-label-marker').length).toBe(3);
    expect(wrapper.findAll('.xy-meter-group-label-text').length).toBe(3);
  });

  it('renders label at start when labelPosition is start', () => {
    const wrapper = mount(MeterGroup, {
      props: { values, labelPosition: 'start' },
    });

    // 标签列表应该出现在 meters 之前
    const children = wrapper.element.children;
    const labelEl = wrapper.find('.xy-meter-group-label-list').element;
    const metersEl = wrapper.find('.xy-meter-group-meters').element;
    expect(Array.from(children).indexOf(labelEl)).toBeLessThan(
      Array.from(children).indexOf(metersEl),
    );
  });

  it('respects min/max to compute percent', () => {
    const wrapper = mount(MeterGroup, {
      props: { values: [{ label: 'A', value: 50, color: '#000' }], min: 0, max: 200 },
    });

    // 50 / 200 = 25% → width: 25%
    const meter = wrapper.find('.xy-meter-group-meter').element as HTMLElement;
    expect(meter.style.width).toBe('25%');
  });

  it('skips rendering meter when value resolves to 0 percent', () => {
    const wrapper = mount(MeterGroup, {
      props: { values: [{ label: 'A', value: 0, color: '#000' }] },
    });

    expect(wrapper.findAll('.xy-meter-group-meter').length).toBe(0);
  });

  it('renders aria attributes', () => {
    const wrapper = mount(MeterGroup, {
      props: { values, min: 0, max: 100 },
    });

    expect(wrapper.attributes('role')).toBe('meter');
    expect(wrapper.attributes('aria-valuemin')).toBe('0');
    expect(wrapper.attributes('aria-valuemax')).toBe('100');
  });

  it('renders custom meter via slot', () => {
    const wrapper = mount(MeterGroup, {
      props: { values },
      slots: {
        meter: `<span class="custom-meter" />`,
      },
    });

    expect(wrapper.findAll('.custom-meter').length).toBe(3);
  });

  it('renders custom label via slot', () => {
    const wrapper = mount(MeterGroup, {
      props: { values },
      slots: {
        label: `<div class="custom-label">total</div>`,
      },
    });

    expect(wrapper.find('.custom-label').exists()).toBe(true);
  });

  it('renders icon marker when item has icon class', () => {
    const wrapper = mount(MeterGroup, {
      props: { values: [{ label: 'A', value: 10, color: '#f00', icon: 'icon-foo' }] },
    });

    expect(wrapper.find('.xy-meter-group-label-icon.icon-foo').exists()).toBe(true);
    expect(wrapper.findAll('.xy-meter-group-label-marker').length).toBe(0);
  });
});
