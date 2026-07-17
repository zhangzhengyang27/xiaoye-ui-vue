import { mount } from '@vue/test-utils';
import Splitter from './Splitter';
import SplitterPanel from './SplitterPanel';
import SplitterDefault, { SplitterPanel as SplitterPanelNamed } from '.';
import mountTest from '../../tests/shared/mountTest';

describe('Splitter', () => {
  mountTest(Splitter);
  mountTest(SplitterPanel);

  it('renders two panels and a gutter handle with default horizontal layout', () => {
    const wrapper = mount(
      {
        components: { Splitter, SplitterPanel },
        template: `
          <Splitter>
            <SplitterPanel class="panel-a">Panel 1</SplitterPanel>
            <SplitterPanel class="panel-b">Panel 2</SplitterPanel>
          </Splitter>
        `,
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-splitter').exists()).toBe(true);
    expect(wrapper.find('.xy-splitter').classes()).toContain('xy-splitter-horizontal');
    expect(wrapper.findAll('.xy-splitter-panel').length).toBe(2);
    expect(wrapper.find('.xy-splitter-gutter-handle').exists()).toBe(true);
    wrapper.unmount();
  });

  it('applies vertical layout class', () => {
    const wrapper = mount(
      {
        components: { Splitter, SplitterPanel },
        template: `
          <Splitter layout="vertical">
            <SplitterPanel>Panel 1</SplitterPanel>
            <SplitterPanel>Panel 2</SplitterPanel>
          </Splitter>
        `,
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-splitter').classes()).toContain('xy-splitter-vertical');
    wrapper.unmount();
  });

  it('renders only one gutter when there are two panels', () => {
    const wrapper = mount(
      {
        components: { Splitter, SplitterPanel },
        template: `
          <Splitter>
            <SplitterPanel>Panel 1</SplitterPanel>
            <SplitterPanel>Panel 2</SplitterPanel>
          </Splitter>
        `,
      },
      { sync: false },
    );
    expect(wrapper.findAll('.xy-splitter-gutter').length).toBe(1);
    wrapper.unmount();
  });

  it('detects SplitterPanel by XYSplitterPanel name (bug fix)', () => {
    // 修复源项目 bug：硬编码 'SplitterPanel' → 'XYSplitterPanel'
    const wrapper = mount(
      {
        components: { Splitter, SplitterPanel },
        template: `
          <Splitter>
            <SplitterPanel>Panel 1</SplitterPanel>
            <SplitterPanel>Panel 2</SplitterPanel>
          </Splitter>
        `,
      },
      { sync: false },
    );
    // 两个 panel 都被识别（gutter 存在说明识别成功）
    expect(wrapper.find('.xy-splitter-gutter').exists()).toBe(true);
    wrapper.unmount();
  });

  it('declares size and minSize props on SplitterPanel (bug fix)', () => {
    // 修复源项目 bug：.d.ts 声明 size/minSize 但 .tsx 未实现
    expect(SplitterPanel.props).toHaveProperty('size');
    expect(SplitterPanel.props).toHaveProperty('minSize');
  });

  it('marks SplitterPanel with __XY_SPLITTER_PANEL flag', () => {
    expect(SplitterPanel.__XY_SPLITTER_PANEL).toBe(true);
  });

  it('marks Splitter with __XY_SPLITTER flag', () => {
    expect(Splitter.__XY_SPLITTER).toBe(true);
  });

  it('exposes onGutterMouseDown method', () => {
    const wrapper = mount(Splitter, {
      global: { components: { SplitterPanel } },
      slots: {
        default: () => [
          <SplitterPanel key="1">Panel 1</SplitterPanel>,
          <SplitterPanel key="2">Panel 2</SplitterPanel>,
        ],
      },
      sync: false,
    });
    expect(typeof wrapper.vm.onGutterMouseDown).toBe('function');
    wrapper.unmount();
  });

  it('marks nested panel with xy-splitter-panel-nested class', () => {
    const wrapper = mount(
      {
        components: { Splitter, SplitterPanel },
        template: `
          <Splitter>
            <SplitterPanel>
              <Splitter>
                <SplitterPanel>Inner 1</SplitterPanel>
                <SplitterPanel>Inner 2</SplitterPanel>
              </Splitter>
            </SplitterPanel>
            <SplitterPanel>Outer 2</SplitterPanel>
          </Splitter>
        `,
      },
      { sync: false },
    );
    // 外层第一个 panel 嵌套了 Splitter，应带 nested 类
    const panels = wrapper.findAll('.xy-splitter-panel');
    expect(panels.length).toBeGreaterThanOrEqual(3);
    expect(panels[0].classes()).toContain('xy-splitter-panel-nested');
    wrapper.unmount();
  });

  it('default export and named export reference same SplitterPanel', () => {
    expect(SplitterPanelNamed).toBe(SplitterPanel);
  });

  it('default export has install function', () => {
    expect(typeof SplitterDefault.install).toBe('function');
  });
});
