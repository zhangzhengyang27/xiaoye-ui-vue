<template>
  <!-- 基础用法：默认按钮风格，点击切换暗色 / 亮色模式 -->
  <xy-space>
    <xy-dark-mode-toggle />
    <xy-dark-mode-toggle default-dark />
  </xy-space>
</template>

<script lang="ts" setup>
// 默认会自动同步 data-theme 属性到 document.documentElement
</script>
