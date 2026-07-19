<template>
  <xy-virtual-list class="demo-virtual-list" :items="items" :item-size="40" scroll-height="320px">
    <template #item="{ item, options }">
      <div
        class="demo-item"
        :class="{ 'demo-item-even': options.even, 'demo-item-odd': options.odd }"
      >
        {{ item.label }}
      </div>
    </template>
  </xy-virtual-list>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 基础用法：大数据量列表仅渲染可视区域项，提升性能。
const items = ref(
  Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    label: `Item ${i + 1}`,
  })),
);
</script>
<style scoped>
.demo-virtual-list {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}
.demo-item {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
}
.demo-item-even {
  background: #fafafa;
}
.demo-item-odd {
  background: #fff;
}
</style>
