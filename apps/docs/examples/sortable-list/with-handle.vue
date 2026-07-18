<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert type="info" show-icon :message="message" />
    <!-- 启用拖拽手柄：只能通过手柄拖动 -->
    <xy-sortable-list :model="items" handle @update="onUpdate" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';

const items = ref([
  { key: '1', label: '任务 A - 设计登录页' },
  { key: '2', label: '任务 B - 实现接口' },
  { key: '3', label: '任务 C - 编写测试' },
  { key: '4', label: '任务 D - 部署上线' },
]);

function onUpdate(e: any) {
  items.value = e.value;
}

const message = computed(() => '优先级排序：' + items.value.map(i => i.label).join(' → '));
</script>
