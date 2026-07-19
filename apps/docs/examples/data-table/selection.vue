<template>
  <xy-space direction="vertical">
    <xy-data-table
      v-model:selection="selected"
      class="demo-data-table"
      :value="products"
      :columns="columns"
      selection-mode="single"
      row-hover
      highlight-on-select
    />
    <div class="demo-value">当前选中：{{ selected ? selected.name : '无' }}</div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 行选择：设置 selection-mode 并 v-model:selection 绑定选中项。
const columns = [
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'category', header: 'Category' },
];

const products = [
  { code: 'f230fh0g3', name: 'Bamboo Watch', category: 'Accessories' },
  { code: 'nvklal433', name: 'Black Watch', category: 'Accessories' },
  { code: 'zz21cz3c1', name: 'Blue Band', category: 'Fitness' },
  { code: '244wgerg2', name: 'Blue T-Shirt', category: 'Clothing' },
];

const selected = ref<any>(null);
</script>
<style scoped>
.demo-data-table {
  width: 100%;
}
.demo-value {
  color: rgba(0, 0, 0, 0.65);
}
</style>
