<template>
  <xy-data-table
    class="demo-data-table"
    :value="products"
    :columns="columns"
    sort-mode="single"
    removable-sort
    show-gridlines
  />
</template>
<script lang="ts" setup>
// 排序：列设置 sortable 后点击表头即可排序，removable-sort 支持第三次点击取消排序。
const columns = [
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name', sortable: true },
  { field: 'category', header: 'Category', sortable: true },
  { field: 'quantity', header: 'Quantity', sortable: true },
];

const products = [
  { code: 'f230fh0g3', name: 'Bamboo Watch', category: 'Accessories', quantity: 24 },
  { code: 'nvklal433', name: 'Black Watch', category: 'Accessories', quantity: 61 },
  { code: 'zz21cz3c1', name: 'Blue Band', category: 'Fitness', quantity: 2 },
  { code: '244wgerg2', name: 'Blue T-Shirt', category: 'Clothing', quantity: 25 },
  { code: 'h456wer53', name: 'Bracelet', category: 'Accessories', quantity: 73 },
];
</script>
<style scoped>
.demo-data-table {
  width: 100%;
}
</style>
