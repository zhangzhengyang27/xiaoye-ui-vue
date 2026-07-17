<script setup lang="ts">
import { isClient } from '@vueuse/core';

const goHome = () => {
  if (!isClient) return;
  window.location.href = '/';
};
</script>

<template>
  <xy-result status="404" title="404" sub-title="页面不存在">
    <template #extra>
      <xy-button type="primary" @click="goHome">返回首页</xy-button>
    </template>
  </xy-result>
</template>

<style scoped>
.ant-result {
  height: 100vh;
  width: 100vw;
}
</style>
