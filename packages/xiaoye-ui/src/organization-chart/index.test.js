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
});
