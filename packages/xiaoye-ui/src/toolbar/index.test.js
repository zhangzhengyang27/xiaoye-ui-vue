import { mount } from '@vue/test-utils';
import Toolbar from '.';
import mountTest from '../../tests/shared/mountTest';

describe('Toolbar', () => {
  mountTest(Toolbar);

  it('renders three groups with default slots', () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Toolbar>
              {{
                start: () => <span class="start">start</span>,
                center: () => <span class="center">center</span>,
                end: () => <span class="end">end</span>,
              }}
            </Toolbar>
          );
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-toolbar').exists()).toBe(true);
    expect(wrapper.find('.xy-toolbar-group-start .start').exists()).toBe(true);
    expect(wrapper.find('.xy-toolbar-group-center .center').exists()).toBe(true);
    expect(wrapper.find('.xy-toolbar-group-end .end').exists()).toBe(true);
    wrapper.unmount();
  });

  it('applies aria-labelledby attribute', () => {
    const wrapper = mount(Toolbar, {
      props: { ariaLabelledby: 'my-label' },
      slots: { start: () => 'x' },
      sync: false,
    });
    expect(wrapper.find('[role="toolbar"]').attributes('aria-labelledby')).toBe('my-label');
    wrapper.unmount();
  });

  it('renders empty groups when slots not provided', () => {
    const wrapper = mount(Toolbar, { sync: false });
    expect(wrapper.findAll('.xy-toolbar-group').length).toBe(3);
    wrapper.unmount();
  });

  // ===== 以下为补充测试 =====

  it('默认插槽内容不会被渲染（组件只支持具名插槽）', () => {
    // Toolbar 仅渲染 start/center/end 三个具名插槽，default 插槽内容应被忽略
    const wrapper = mount(
      {
        render() {
          return (
            <Toolbar>
              <span class="default-content">不应被渲染</span>
            </Toolbar>
          );
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.default-content').exists()).toBe(false);
    // 三个 group 仍应存在
    expect(wrapper.findAll('.xy-toolbar-group').length).toBe(3);
    wrapper.unmount();
  });

  it('未传入 aria-labelledby 时根元素不包含该属性', () => {
    // 默认状态下 aria-labelledby 应为 undefined（不渲染该属性）
    const wrapper = mount(Toolbar, { sync: false });
    const root = wrapper.find('.xy-toolbar');
    expect(root.attributes('aria-labelledby')).toBe(undefined);
    wrapper.unmount();
  });

  it('根元素始终具有 role="toolbar" 属性', () => {
    // 验证语义化角色属性始终存在于根元素
    const wrapper = mount(
      {
        render() {
          return <Toolbar>{{ start: () => <span>开始</span> }}</Toolbar>;
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-toolbar').attributes('role')).toBe('toolbar');
    wrapper.unmount();
  });

  it('根元素 class 包含 xy-toolbar 前缀类名', () => {
    // 验证 prefixCls 正确生成 xy-toolbar 类名
    const wrapper = mount(Toolbar, { sync: false });
    const rootClass = wrapper.find('.xy-toolbar');
    expect(rootClass.exists()).toBe(true);
    // 三个 group 也应使用 xy-toolbar-group 类名
    expect(wrapper.findAll('.xy-toolbar-group-start').length).toBe(1);
    expect(wrapper.findAll('.xy-toolbar-group-center').length).toBe(1);
    expect(wrapper.findAll('.xy-toolbar-group-end').length).toBe(1);
    wrapper.unmount();
  });

  it('start 插槽支持渲染多个子元素', () => {
    // 验证 toolbar 内 start 插槽可以容纳多个按钮元素并正确渲染
    const wrapper = mount(
      {
        render() {
          return (
            <Toolbar>
              {{
                start: () => (
                  <>
                    <button class="btn-1">按钮1</button>
                    <button class="btn-2">按钮2</button>
                    <button class="btn-3">按钮3</button>
                  </>
                ),
              }}
            </Toolbar>
          );
        },
      },
      { sync: false },
    );
    const startGroup = wrapper.find('.xy-toolbar-group-start');
    expect(startGroup.findAll('button').length).toBe(3);
    expect(startGroup.find('.btn-1').exists()).toBe(true);
    expect(startGroup.find('.btn-2').exists()).toBe(true);
    expect(startGroup.find('.btn-3').exists()).toBe(true);
    wrapper.unmount();
  });
});
