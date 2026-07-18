<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert type="info" show-icon :message="message" />
    <xy-sortable-list :model="items" @update="onUpdate" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';

// 列表数据，每项必须含 key 和 label
const items = ref([
  { key: '1', label: '列表项 1' },
  { key: '2', label: '列表项 2' },
  { key: '3', label: '列表项 3' },
  { key: '4', label: '列表项 4' },
  { key: '5', label: '列表项 5' },
]);

// 处理顺序更新事件
function onUpdate(e: any) {
  items.value = e.value;
}

// 展示当前顺序
const message = computed(() => '当前顺序：' + items.value.map(i => i.label).join(' → '));
</script>
