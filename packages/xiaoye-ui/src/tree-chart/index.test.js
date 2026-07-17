import { mount } from '@vue/test-utils';
import TreeChart from '.';
import mountTest from '../../tests/shared/mountTest';

describe('TreeChart', () => {
  mountTest(TreeChart);

  const treeData = {
    key: '0',
    label: 'Root',
    children: [
      { key: '0-0', label: 'Child 1' },
      { key: '0-1', label: 'Child 2' },
    ],
  };

  it('marks with __XY_TREE_CHART flag', () => {
    expect(TreeChart.__XY_TREE_CHART).toBe(true);
  });

  it('has install function', () => {
    expect(typeof TreeChart.install).toBe('function');
  });

  it('renders basic tree chart with value', () => {
    const wrapper = mount(TreeChart, {
      props: { value: treeData },
    });
    expect(wrapper.find('.xy-treechart').exists()).toBe(true);
    expect(wrapper.find('.xy-treechart-table').exists()).toBe(true);
    expect(wrapper.find('.xy-treechart-node').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders selectable node in single selection mode', () => {
    const wrapper = mount(TreeChart, {
      props: {
        value: treeData,
        selectionMode: 'single',
        selectionKeys: { 0: true },
      },
    });
    expect(wrapper.find('.xy-treechart-node-selectable').exists()).toBe(true);
    expect(wrapper.find('.xy-treechart-node-selected').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders toggle button when collapsible', () => {
    const wrapper = mount(TreeChart, {
      props: { value: treeData, collapsible: true },
    });
    expect(wrapper.find('.xy-treechart-node-toggle-button').exists()).toBe(true);
    wrapper.unmount();
  });

  it('does not render toggle button when not collapsible', () => {
    const wrapper = mount(TreeChart, {
      props: { value: treeData, collapsible: false },
    });
    expect(wrapper.find('.xy-treechart-node-toggle-button').exists()).toBe(false);
    wrapper.unmount();
  });

  it('renders custom node content via default slot', () => {
    const wrapper = mount(TreeChart, {
      props: { value: treeData },
      slots: {
        default: ({ node }) => `Node: ${node.label}`,
      },
    });
    expect(wrapper.text()).toContain('Node: Root');
    wrapper.unmount();
  });

  it('emits node-select on node click in selection mode', async () => {
    const wrapper = mount(TreeChart, {
      props: {
        value: treeData,
        selectionMode: 'single',
      },
    });
    await wrapper.find('.xy-treechart-node').trigger('click');
    expect(wrapper.emitted('node-select')).toBeTruthy();
    wrapper.unmount();
  });

  it('emits node-collapse on toggle button click', async () => {
    const wrapper = mount(TreeChart, {
      props: { value: treeData, collapsible: true },
    });
    await wrapper.find('.xy-treechart-node-toggle-button').trigger('click');
    expect(wrapper.emitted('node-collapse')).toBeTruthy();
    wrapper.unmount();
  });
});
