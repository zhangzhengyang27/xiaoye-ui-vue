import { mount } from '@vue/test-utils';
import Chart from '.';
import mountTest from '../../tests/shared/mountTest';

// mock chart.js/auto 的动态 import，避免 jsdom 下 canvas 报错
vi.mock('chart.js/auto', () => ({
  default: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
    toBase64Image: vi.fn(() => 'data:image/png;base64,xxx'),
    generateLegend: vi.fn(() => '<ul class="legend"></ul>'),
    getElementsAtEventForMode: vi.fn(() => []),
  })),
}));

describe('Chart', () => {
  mountTest(Chart);

  it('has correct name and flag', () => {
    expect(Chart.name).toBe('XYChart');
    expect(Chart.__XY_CHART).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof Chart.install).toBe('function');
  });

  it('renders canvas with default width/height', () => {
    const wrapper = mount(Chart);
    const canvas = wrapper.find('canvas');
    expect(canvas.exists()).toBe(true);
    expect(canvas.attributes('width')).toBe('300');
    expect(canvas.attributes('height')).toBe('150');
    expect(canvas.classes()).toContain('xy-chart-canvas');
    wrapper.unmount();
  });

  it('renders root element with xy-chart class', () => {
    const wrapper = mount(Chart);
    expect(wrapper.find('.xy-chart').exists()).toBe(true);
    wrapper.unmount();
  });

  it('accepts custom width/height', () => {
    const wrapper = mount(Chart, {
      props: { width: 500, height: 250 },
    });
    const canvas = wrapper.find('canvas');
    expect(canvas.attributes('width')).toBe('500');
    expect(canvas.attributes('height')).toBe('250');
    wrapper.unmount();
  });

  it('exposes chart manipulation methods', () => {
    const wrapper = mount(Chart);
    const vm = wrapper.vm;
    expect(typeof vm.getCanvas).toBe('function');
    expect(typeof vm.getChart).toBe('function');
    expect(typeof vm.getBase64Image).toBe('function');
    expect(typeof vm.refresh).toBe('function');
    expect(typeof vm.reinit).toBe('function');
    expect(typeof vm.generateLegend).toBe('function');
    wrapper.unmount();
  });

  it('getCanvas returns the canvas element', () => {
    const wrapper = mount(Chart);
    const vm = wrapper.vm;
    const canvas = vm.getCanvas();
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    wrapper.unmount();
  });
});
