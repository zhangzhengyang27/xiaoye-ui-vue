<template>
  <xy-data-table
    class="demo-data-table"
    :value="products"
    :columns="columns"
    show-gridlines
    striped-rows
  />
</template>
<script lang="ts" setup>
// 基础用法：通过 value 绑定数据，columns 定义列。
const columns = [
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'category', header: 'Category' },
  { field: 'quantity', header: 'Quantity' },
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
