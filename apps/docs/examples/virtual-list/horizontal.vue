<template>
  <xy-virtual-list
    class="demo-virtual-list-horizontal"
    :items="items"
    :item-size="120"
    scroll-width="600px"
    orientation="horizontal"
  >
    <template #item="{ item }">
      <div class="demo-card">
        {{ item.label }}
      </div>
    </template>
  </xy-virtual-list>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 水平方向：设置 orientation="horizontal" 与 scroll-width 实现横向虚拟滚动。
const items = ref(
  Array.from({ length: 500 }, (_, i) => ({
    id: i,
    label: `Card ${i + 1}`,
  })),
);
</script>
<style scoped>
.demo-virtual-list-horizontal {
  height: 160px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}
.demo-card {
  width: 120px;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #f0f0f0;
  box-sizing: border-box;
}
</style>
