import { mount } from '@vue/test-utils';
import OrganizationChart from '.';
import mountTest from '../../tests/shared/mountTest';

describe('OrganizationChart', () => {
  mountTest(OrganizationChart);

  const treeData = {
    key: '0',
    label: 'Root',
    children: [
      { key: '0-0', label: 'Child 1' },
      { key: '0-1', label: 'Child 2' },
    ],
  };

  it('marks with __XY_ORGANIZATION_CHART flag', () => {
    expect(OrganizationChart.__XY_ORGANIZATION_CHART).toBe(true);
  });

  it('has install function', () => {
    expect(typeof OrganizationChart.install).toBe('function');
  });

  it('renders basic organization chart with value', () => {
    const wrapper = mount(OrganizationChart, {
      props: { value: treeData },
    });
    expect(wrapper.find('.xy-organizationchart').exists()).toBe(true);
    expect(wrapper.find('.xy-organizationchart-table').exists()).toBe(true);
    expect(wrapper.find('.xy-organizationchart-node').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders selectable node in single selection mode', () => {
    const wrapper = mount(OrganizationChart, {
      props: {
        value: treeData,
        selectionMode: 'single',
        selectionKeys: { 0: true },
      },
    });
    expect(wrapper.find('.xy-organizationchart-node-selectable').exists()).toBe(true);
    expect(wrapper.find('.xy-organizationchart-node-selected').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders toggle button when collapsible', () => {
    const wrapper = mount(OrganizationChart, {
      props: { value: treeData, collapsible: true },
    });
    expect(wrapper.find('.xy-organizationchart-node-toggle-button').exists()).toBe(true);
    wrapper.unmount();
  });

  it('does not render toggle button when not collapsible', () => {
    const wrapper = mount(OrganizationChart, {
      props: { value: treeData, collapsible: false },
    });
    expect(wrapper.find('.xy-organizationchart-node-toggle-button').exists()).toBe(false);
    wrapper.unmount();
  });

  it('renders custom node content via default slot', () => {
    const wrapper = mount(OrganizationChart, {
      props: { value: treeData },
      slots: {
        default: ({ node }) => `Node: ${node.label}`,
      },
    });
    expect(wrapper.text()).toContain('Node: Root');
    wrapper.unmount();
  });

  it('emits node-select on node click in selection mode', async () => {
    const wrapper = mount(OrganizationChart, {
      props: {
        value: treeData,
        selectionMode: 'single',
      },
    });
    await wrapper.find('.xy-organizationchart-node').trigger('click');
    expect(wrapper.emitted('node-select')).toBeTruthy();
    wrapper.unmount();
  });

  it('emits node-collapse on toggle button click', async () => {
    const wrapper = mount(OrganizationChart, {
      props: { value: treeData, collapsible: true },
    });
    await wrapper.find('.xy-organizationchart-node-toggle-button').trigger('click');
    expect(wrapper.emitted('node-collapse')).toBeTruthy();
    wrapper.unmount();
  });

  // ===== a11y tests =====

  it('renders correct ARIA roles and default aria-label', () => {
    const wrapper = mount(OrganizationChart, {
      props: { value: treeData },
    });
    const root = wrapper.find('.xy-organizationchart');
    expect(root.attributes('role')).toBe('tree');
    expect(root.attributes('aria-label')).toBe('组织架构图');
    const treeitems = wrapper.findAll('[role="treeitem"]');
    expect(treeitems.length).toBe(3); // root + 2 children
    // root has children and is expanded by default
    expect(treeitems[0].attributes('aria-expanded')).toBe('true');
    // leaf nodes should not expose aria-expanded
    expect(treeitems[1].attributes('aria-expanded')).toBeUndefined();
    // children container uses role="group"
    expect(wrapper.find('[role="group"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it('uses custom ariaLabel when provided', () => {
    const wrapper = mount(OrganizationChart, {
      props: { value: treeData, ariaLabel: '自定义架构图' },
    });
    expect(wrapper.find('.xy-organizationchart').attributes('aria-label')).toBe('自定义架构图');
    wrapper.unmount();
  });

  it('moves focus with ArrowDown and ArrowUp between nodes', async () => {
    const wrapper = mount(OrganizationChart, {
      props: { value: treeData },
    });
    let treeitems = wrapper.findAll('[role="treeitem"]');
    // Initially the root node is the roving tab stop
    expect(treeitems[0].attributes('tabindex')).toBe('0');
    expect(treeitems[1].attributes('tabindex')).toBe('-1');

    // ArrowDown moves focus to the first child
    await treeitems[0].trigger('keydown', { key: 'ArrowDown' });
    treeitems = wrapper.findAll('[role="treeitem"]');
    expect(treeitems[0].attributes('tabindex')).toBe('-1');
    expect(treeitems[1].attributes('tabindex')).toBe('0');

    // ArrowUp moves focus back to the root
    await treeitems[1].trigger('keydown', { key: 'ArrowUp' });
    treeitems = wrapper.findAll('[role="treeitem"]');
    expect(treeitems[0].attributes('tabindex')).toBe('0');
    expect(treeitems[1].attributes('tabindex')).toBe('-1');
    wrapper.unmount();
  });

  it('emits node-select on Enter and Space keydown', async () => {
    // Enter
    const wrapperEnter = mount(OrganizationChart, {
      props: { value: treeData, selectionMode: 'single' },
    });
    await wrapperEnter.find('[role="treeitem"]').trigger('keydown', { key: 'Enter' });
    expect(wrapperEnter.emitted('node-select')).toBeTruthy();
    wrapperEnter.unmount();

    // Space
    const wrapperSpace = mount(OrganizationChart, {
      props: { value: treeData, selectionMode: 'single' },
    });
    await wrapperSpace.find('[role="treeitem"]').trigger('keydown', { key: ' ' });
    expect(wrapperSpace.emitted('node-select')).toBeTruthy();
    wrapperSpace.unmount();
  });

  it('reflects aria-selected on selected nodes', () => {
    const wrapper = mount(OrganizationChart, {
      props: {
        value: treeData,
        selectionMode: 'single',
        selectionKeys: { 0: true },
      },
    });
    const treeitems = wrapper.findAll('[role="treeitem"]');
    expect(treeitems[0].attributes('aria-selected')).toBe('true');
    wrapper.unmount();
  });

  // ===== 业务测试 =====

  // 单选取消选中：点击已选中的节点触发 node-unselect 事件
  it('emits node-unselect when clicking a selected node in single mode', async () => {
    const wrapper = mount(OrganizationChart, {
      props: {
        value: treeData,
        selectionMode: 'single',
        selectionKeys: { 0: true },
      },
    });
    await wrapper.find('.xy-organizationchart-node').trigger('click');
    expect(wrapper.emitted('node-unselect')).toBeTruthy();
    wrapper.unmount();
  });

  // 折叠节点：collapsedKeys 中包含节点 key 时子节点不可见
  it('hides children when node is collapsed via collapsedKeys', () => {
    const wrapper = mount(OrganizationChart, {
      props: {
        value: treeData,
        collapsedKeys: { 0: true },
      },
    });
    const treeitems = wrapper.findAll('[role="treeitem"]');
    // 根节点被折叠，aria-expanded 应为 false
    expect(treeitems[0].attributes('aria-expanded')).toBe('false');
    // 子节点行应不可见
    const childrenRow = wrapper.find('.xy-organizationchart-node-children');
    expect(childrenRow.exists()).toBe(true);
    expect(childrenRow.attributes('style') || '').toMatch(/visibility:\s*hidden/);
    wrapper.unmount();
  });

  // 自定义节点模板：通过 node.type 匹配的具名插槽渲染节点内容
  it('renders typed node via named slot matching node.type', () => {
    const typedData = {
      key: '0',
      label: 'Root',
      type: 'person',
      children: [{ key: '0-0', label: 'Child 1' }],
    };
    const wrapper = mount(OrganizationChart, {
      props: { value: typedData },
      slots: {
        person: ({ node }) => `Person: ${node.label}`,
        default: ({ node }) => `Default: ${node.label}`,
      },
    });
    // 根节点有 type='person'，使用 person 插槽
    expect(wrapper.text()).toContain('Person: Root');
    // 子节点没有 type，使用 default 插槽
    expect(wrapper.text()).toContain('Default: Child 1');
    wrapper.unmount();
  });
});
