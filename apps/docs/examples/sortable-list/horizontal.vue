<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert type="info" show-icon :message="message" />
    <!-- 水平方向拖拽：axis="x" -->
    <xy-sortable-list :model="items" axis="x" @update="onUpdate" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';

const items = ref([
  { key: '1', label: '步骤 1' },
  { key: '2', label: '步骤 2' },
  { key: '3', label: '步骤 3' },
  { key: '4', label: '步骤 4' },
]);

function onUpdate(e: any) {
  items.value = e.value;
}

const message = computed(() => '横向顺序：' + items.value.map(i => i.label).join(' → '));
</script>
