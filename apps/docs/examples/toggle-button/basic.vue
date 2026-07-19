<template>
  <xy-space direction="vertical">
    <xy-toggle-button v-model:value="checked" />
    <div class="demo-value">状态：{{ checked }}</div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 基础用法：作为开关使用，v-model:value 绑定布尔值。
const checked = ref(false);
</script>
<style scoped>
.demo-value {
  color: rgba(0, 0, 0, 0.65);
}
</style>
