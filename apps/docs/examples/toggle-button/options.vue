<template>
  <xy-space direction="vertical">
    <xy-toggle-button v-model:value="selected" :options="options" />
    <div class="demo-value">选中：{{ selected }}</div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 选项模式：传入 options 后组件渲染为一组互斥按钮。
const selected = ref('day');
const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
];
</script>
<style scoped>
.demo-value {
  color: rgba(0, 0, 0, 0.65);
}
</style>
