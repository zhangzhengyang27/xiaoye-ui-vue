<template>
  <xy-tree-table
    v-model:first="first"
    :value="nodes"
    :rows="rows"
    pagination
    :rows-per-page-options="[2, 4, 6]"
  >
    <Column field="name" header="名称" expander />
    <Column field="category" header="分类" />
    <Column field="price" header="价格" />
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
  data: { name: string; category: string; price: string };
  children?: TreeNode[];
}

const first = ref(0);
const rows = ref(4);

const categories = ['数码', '服饰', '家居', '食品', '美妆'];
const nodes: TreeNode[] = Array.from({ length: 12 }).map((_, i) => ({
  key: String(i),
  data: {
    name: `分类 ${i + 1}`,
    category: categories[i % categories.length],
    price: `¥${Math.round(Math.random() * 900 + 100)}`,
  },
  children: [
    {
      key: `${i}-0`,
      data: {
        name: `子分类 ${i + 1}-1`,
        category: categories[i % categories.length],
        price: `¥${Math.round(Math.random() * 900 + 100)}`,
      },
    },
    {
      key: `${i}-1`,
      data: {
        name: `子分类 ${i + 1}-2`,
        category: categories[i % categories.length],
        price: `¥${Math.round(Math.random() * 900 + 100)}`,
      },
    },
  ],
}));
</script>
