<template>
  <!-- 垂直方向：设置 orientation="vertical" 让进度条纵向展示 -->
  <div style="height: 200px; display: inline-flex; align-items: flex-end">
    <xy-meter-group
      :values="values"
      orientation="vertical"
      label-position="end"
      label-orientation="vertical"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const values = ref([
  { label: 'CPU', value: 40, color: '#1677ff' },
  { label: '内存', value: 30, color: '#52c41a' },
  { label: '磁盘', value: 20, color: '#faad14' },
]);
</script>
