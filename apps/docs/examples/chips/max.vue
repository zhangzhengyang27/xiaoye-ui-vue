<template>
  <xy-space direction="vertical">
    <xy-chips v-model:value="tags" :max="3" placeholder="最多输入 3 个标签" />
    <div class="demo-value">数量：{{ tags.length }} / 3</div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 最大数量：达到 max 后输入框自动禁用。
const tags = ref<string[]>(['Design']);
</script>
<style scoped>
.demo-value {
  color: rgba(0, 0, 0, 0.65);
}
</style>
