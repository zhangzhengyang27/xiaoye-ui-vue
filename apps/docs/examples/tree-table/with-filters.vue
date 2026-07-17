<template>
  <xy-tree-table :value="nodes" :filters="filters" filter-mode="lenient">
    <Column field="name" header="名称" expander>
      <template #filter>
        <xy-input
          v-model:value="filters.name.value"
          placeholder="按名称筛选"
          allow-clear
          size="small"
        />
      </template>
    </Column>
    <Column field="type" header="类型" filter-match-mode="equals">
      <template #filter>
        <xy-input
          v-model:value="filters.type.value"
          placeholder="按类型筛选"
          allow-clear
          size="small"
        />
      </template>
    </Column>
    <Column field="size" header="大小" />
  </xy-tree-table>
</template>

<script lang="ts" setup>
import { defineComponent, reactive } from 'vue';

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
  data: { name: string; type: string; size: string };
  children?: TreeNode[];
}

const filters = reactive<{
  name: { value: string; matchMode: string };
  type: { value: string; matchMode: string };
}>({
  name: { value: '', matchMode: 'contains' },
  type: { value: '', matchMode: 'contains' },
});

const nodes: TreeNode[] = [
  {
    key: '0',
    data: { name: 'documents', type: 'folder', size: '12MB' },
    children: [
      { key: '0-0', data: { name: 'report.pdf', type: 'file', size: '2MB' } },
      { key: '0-1', data: { name: 'notes.md', type: 'file', size: '64KB' } },
      {
        key: '0-2',
        data: { name: 'images', type: 'folder', size: '8MB' },
        children: [
          { key: '0-2-0', data: { name: 'photo.jpg', type: 'file', size: '4MB' } },
          { key: '0-2-1', data: { name: 'banner.png', type: 'file', size: '1MB' } },
        ],
      },
    ],
  },
  {
    key: '1',
    data: { name: 'downloads', type: 'folder', size: '32MB' },
    children: [
      { key: '1-0', data: { name: 'setup.exe', type: 'file', size: '20MB' } },
      { key: '1-1', data: { name: 'archive.zip', type: 'file', size: '12MB' } },
    ],
  },
];
</script>
