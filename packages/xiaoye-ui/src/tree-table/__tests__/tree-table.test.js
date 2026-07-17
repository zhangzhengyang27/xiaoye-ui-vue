import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import TreeTable from '../TreeTable';
import TreeTableDefault from '..';
import mountTest from '../../../tests/shared/mountTest';

// mock Column 组件：name 必须为 'Column' 以匹配 HelperSet 的 type
const Column = defineComponent({
  name: 'Column',
  props: {
    field: String,
    header: String,
    sortable: Boolean,
    expander: Boolean,
    frozen: Boolean,
    alignFrozen: String,
    filterField: String,
    filterMatchMode: String,
    filterHeaderStyle: Object,
    filterHeaderClass: String,
    headerStyle: Object,
    headerClass: String,
    bodyStyle: Object,
    bodyClass: String,
    footerStyle: Object,
    footerClass: String,
    footer: String,
    sortField: String,
    columnKey: String,
    style: Object,
    class: [String, Object, Array],
    hidden: Boolean,
  },
  setup() {
    return () => null;
  },
});

const sampleData = [
  {
    key: '0',
    data: { name: 'Item 0', size: '100kb', type: 'folder' },
    children: [
      {
        key: '0-0',
        data: { name: 'Item 0-0', size: '20kb', type: 'file' },
      },
      {
        key: '0-1',
        data: { name: 'Item 0-1', size: '80kb', type: 'folder' },
        children: [
          {
            key: '0-1-0',
            data: { name: 'Item 0-1-0', size: '50kb', type: 'file' },
          },
        ],
      },
    ],
  },
  {
    key: '1',
    data: { name: 'Item 1', size: '200kb', type: 'file' },
  },
];

describe('TreeTable', () => {
  mountTest(TreeTable);

  it('renders root with xy-tree-table class', () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="[]">
            <Column field="name" header="Name" />
            <Column field="size" header="Size" />
          </TreeTable>
        `,
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-tree-table').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders table with treegrid role', () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="[]">
            <Column field="name" header="Name" />
          </TreeTable>
        `,
      },
      { sync: false },
    );
    expect(wrapper.find('table[role="treegrid"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders empty message when value is empty', () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="[]">
            <Column field="name" header="Name" />
          </TreeTable>
        `,
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-tree-table-empty-message').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders header cells from Column children', () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="[]">
            <Column field="name" header="Name" />
            <Column field="size" header="Size" />
          </TreeTable>
        `,
      },
      { sync: false },
    );
    const headers = wrapper.findAll('.xy-tree-table-cell-header');
    expect(headers.length).toBe(2);
    expect(wrapper.find('.xy-tree-table-column-title').text()).toBe('Name');
    wrapper.unmount();
  });

  it('renders data rows for top-level nodes', () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="data">
            <Column field="name" header="Name" expander />
            <Column field="size" header="Size" />
          </TreeTable>
        `,
        data() {
          return { data: sampleData };
        },
      },
      { sync: false },
    );
    const rows = wrapper.findAll('.xy-tree-table-row');
    expect(rows.length).toBe(2);
    wrapper.unmount();
  });

  it('expands child nodes when expandedKeys is set', async () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="data" :expandedKeys="expandedKeys">
            <Column field="name" header="Name" expander />
            <Column field="size" header="Size" />
          </TreeTable>
        `,
        data() {
          return {
            data: sampleData,
            expandedKeys: { 0: true },
          };
        },
      },
      { sync: false },
    );
    const rows = wrapper.findAll('.xy-tree-table-row');
    // 2 top-level + 2 children of node 0
    expect(rows.length).toBe(4);
    wrapper.unmount();
  });

  it('applies size class', () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="[]" size="small">
            <Column field="name" header="Name" />
          </TreeTable>
        `,
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-tree-table').classes()).toContain('xy-tree-table-sm');
    wrapper.unmount();
  });

  it('applies gridlines class', () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="[]" showGridlines>
            <Column field="name" header="Name" />
          </TreeTable>
        `,
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-tree-table').classes()).toContain('xy-tree-table-gridlines');
    wrapper.unmount();
  });

  it('applies scrollable class', () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="[]" scrollable scrollHeight="200px">
            <Column field="name" header="Name" />
          </TreeTable>
        `,
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-tree-table').classes()).toContain('xy-tree-table-scrollable');
    wrapper.unmount();
  });

  it('emits nodeExpand when toggling a node', async () => {
    const wrapper = mount(
      {
        components: { TreeTable, Column },
        template: `
          <TreeTable :value="data" @nodeExpand="onNodeExpand">
            <Column field="name" header="Name" expander />
          </TreeTable>
        `,
        data() {
          return { data: sampleData };
        },
        methods: {
          onNodeExpand(node) {
            this.$emit('nodeExpand', node);
          },
        },
      },
      { sync: false },
    );
    const toggleButton = wrapper.find('.xy-tree-table-node-toggle-button');
    expect(toggleButton.exists()).toBe(true);
    await toggleButton.trigger('click');
    // TreeTable should emit nodeExpand
    expect(wrapper.emitted('nodeExpand')).toBeTruthy();
    wrapper.unmount();
  });

  it('exports default with install method', () => {
    expect(TreeTableDefault).toBeTruthy();
    expect(TreeTableDefault.install).toBeInstanceOf(Function);
  });

  it('registers as xy-tree-table tag name via install', () => {
    const app = {
      component(tag, comp) {
        expect(tag).toBe('xy-tree-table');
      },
      _components: {},
    };
    TreeTableDefault.install(app);
  });
});
