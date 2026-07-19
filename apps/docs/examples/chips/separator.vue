<template>
  <xy-space direction="vertical">
    <xy-chips v-model:value="tags" separator="," placeholder="支持逗号分隔批量输入" />
    <div class="demo-value">当前标签：{{ tags.join(', ') || '无' }}</div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 分隔符：输入逗号或粘贴含逗号的文本可批量添加标签。
const tags = ref<string[]>(['a', 'b']);
</script>
<style scoped>
.demo-value {
  color: rgba(0, 0, 0, 0.65);
}
</style>
