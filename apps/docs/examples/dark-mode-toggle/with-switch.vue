<template>
  <!-- 开关风格：variant="switch"，左右两侧分别显示月亮 / 太阳图标 -->
  <xy-space direction="vertical">
    <xy-dark-mode-toggle v-model:dark="dark" variant="switch" />
    <xy-dark-mode-toggle v-model:dark="dark" variant="switch" size="small" />
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const dark = ref(false);
</script>
