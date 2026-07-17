<template>
  <xy-tree-table
    :value="nodes"
    :sort-field="sortField"
    :sort-order="sortOrder"
    @update:sort-field="onSortFieldChange"
    @update:sort-order="onSortOrderChange"
  >
    <Column field="name" header="名称" expander />
    <Column field="age" header="年龄" sortable />
    <Column field="score" header="得分" sortable />
  </xy-tree-table>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

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
  data: { name: string; age: number; score: number };
  children?: TreeNode[];
}

const sortField = ref<string | null>(null);
const sortOrder = ref<number | null>(null);

function onSortFieldChange(val: string | null) {
  sortField.value = val;
}
function onSortOrderChange(val: number | null) {
  sortOrder.value = val;
}

const nodes: TreeNode[] = [
  {
    key: '0',
    data: { name: '一组', age: 30, score: 88 },
    children: [
      { key: '0-0', data: { name: '张三', age: 25, score: 92 } },
      { key: '0-1', data: { name: '李四', age: 28, score: 76 } },
    ],
  },
  {
    key: '1',
    data: { name: '二组', age: 32, score: 95 },
    children: [
      { key: '1-0', data: { name: '王五', age: 24, score: 81 } },
      { key: '1-1', data: { name: '赵六', age: 27, score: 89 } },
    ],
  },
];
</script>
