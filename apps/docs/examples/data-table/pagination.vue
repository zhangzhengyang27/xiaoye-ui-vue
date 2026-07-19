<template>
  <xy-data-table
    v-model:first="first"
    class="demo-data-table"
    :value="products"
    :columns="columns"
    :rows="3"
    :total-records="products.length"
    pagination
    show-gridlines
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 分页：设置 paginator、rows 与 total-records，并通过 v-model:first 控制当前页起始索引。
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
  { code: 'h456wer53', name: 'Bracelet', category: 'Accessories' },
  { code: 'av2231fwg', name: 'Brown Purse', category: 'Accessories' },
  { code: 'bib36pfvm', name: 'Chakra Bracelet', category: 'Accessories' },
];

const first = ref(0);
</script>
<style scoped>
.demo-data-table {
  width: 100%;
}
</style>
