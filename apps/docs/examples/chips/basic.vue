<template>
  <xy-space direction="vertical">
    <xy-chips v-model:value="tags" placeholder="输入后按回车添加标签" />
    <div class="demo-value">当前标签：{{ tags.join(', ') || '无' }}</div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 基础用法：输入文本后按回车生成标签，点击 × 删除。
const tags = ref<string[]>(['Vue', 'TypeScript']);
</script>
<style scoped>
.demo-value {
  color: rgba(0, 0, 0, 0.65);
}
</style>
