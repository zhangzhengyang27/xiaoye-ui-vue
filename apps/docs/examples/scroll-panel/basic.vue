<template>
  <xy-scroll-panel class="demo-scroll-panel">
    <p v-for="i in 20" :key="i">
      {{ i }}. 这是一段用于演示 ScrollPanel 自定义滚动条的长文本内容。ScrollPanel
      会在容器内部隐藏原生滚动条，并提供可拖拽的自定义滚动条。
    </p>
  </xy-scroll-panel>
</template>
<script lang="ts" setup>
// 基础用法：将需要滚动的内容放入默认插槽，组件会自动计算滚动条位置。
</script>
<style scoped>
.demo-scroll-panel {
  height: 240px;
  padding: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}
.demo-scroll-panel p {
  margin: 0 0 12px;
  line-height: 1.6;
}
</style>
