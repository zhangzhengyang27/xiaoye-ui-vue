<template>
  <!-- 自定义图标：通过 sun-icon / moon-icon 属性传入自定义 VNode -->
  <xy-space>
    <xy-dark-mode-toggle v-model:dark="dark" :sun-icon="renderSun" :moon-icon="renderMoon" />
    <xy-dark-mode-toggle v-model:dark="dark">
      <template #sunIcon>☀️</template>
      <template #moonIcon>🌙</template>
    </xy-dark-mode-toggle>
  </xy-space>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { LightbulbIcon } from '@xiaoye-ui/icons';

const dark = ref(false);

// 通过 h() 函数返回自定义 VNode
const renderSun = () => h(LightbulbIcon);
const renderMoon = () => h(LightbulbIcon);
</script>
