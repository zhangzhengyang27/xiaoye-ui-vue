<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="warning"
      show-icon
      message="第二项设置了 disabled: true，无法被拖动，但其他项仍可正常排序"
    />
    <xy-sortable-list :model="items" @update="onUpdate" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const items = ref([
  { key: '1', label: '可拖拽项 1' },
  { key: '2', label: '禁用项（不可拖动）', disabled: true },
  { key: '3', label: '可拖拽项 3' },
  { key: '4', label: '可拖拽项 4' },
]);

function onUpdate(e: any) {
  items.value = e.value;
}
</script>
