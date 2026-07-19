<template>
  <xy-space direction="vertical">
    <xy-toggle-button v-model:value="selected" :options="options" multiple />
    <div class="demo-value">选中：{{ selected.join(', ') || '无' }}</div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 多选模式：开启 multiple 后可同时选中多个选项。
const selected = ref<string[]>(['vue']);
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
];
</script>
<style scoped>
.demo-value {
  color: rgba(0, 0, 0, 0.65);
}
</style>
