<template>
  <xy-tree-table :value="nodes">
    <Column field="name" header="名称" expander />
    <Column field="size" header="大小" />
    <Column field="type" header="类型" />
    <Column field="modified" header="修改时间" />
  </xy-tree-table>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';

// TreeTable 通过 HelperSet 收集 name: 'Column' 的子组件作为列定义
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

interface TreeNode {
  key: string;
  data: {
    name: string;
    size: string;
    type: string;
    modified: string;
  };
  children?: TreeNode[];
}

const nodes: TreeNode[] = [
  {
    key: '0',
    data: { name: 'src', size: '4.2MB', type: 'folder', modified: '2026-07-10' },
    children: [
      {
        key: '0-0',
        data: { name: 'components', size: '2.1MB', type: 'folder', modified: '2026-07-09' },
        children: [
          {
            key: '0-0-0',
            data: { name: 'Button.tsx', size: '8KB', type: 'file', modified: '2026-07-08' },
          },
          {
            key: '0-0-1',
            data: { name: 'Input.tsx', size: '6KB', type: 'file', modified: '2026-07-08' },
          },
        ],
      },
      {
        key: '0-1',
        data: { name: 'index.ts', size: '2KB', type: 'file', modified: '2026-07-10' },
      },
    ],
  },
  {
    key: '1',
    data: { name: 'package.json', size: '1KB', type: 'file', modified: '2026-07-01' },
  },
  {
    key: '2',
    data: { name: 'README.md', size: '3KB', type: 'file', modified: '2026-06-30' },
  },
];
</script>
