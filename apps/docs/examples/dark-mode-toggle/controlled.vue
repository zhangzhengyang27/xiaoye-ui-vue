<template>
  <!-- 受控用法：v-model:dark 双向绑定，并展示当前状态 -->
  <xy-space direction="vertical">
    <xy-dark-mode-toggle v-model:dark="dark" />
    <span>当前模式：{{ dark ? '🌙 暗色' : '☀️ 亮色' }}</span>
    <xy-button size="small" @click="dark = !dark">外部切换</xy-button>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const dark = ref(false);
</script>
