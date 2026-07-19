<template>
  <xy-scroll-panel class="demo-scroll-panel-horizontal">
    <div class="demo-content">
      <div v-for="i in 12" :key="i" class="demo-card">Card {{ i }}</div>
    </div>
  </xy-scroll-panel>
</template>
<script lang="ts" setup>
// 水平滚动：内容宽度超出容器时，组件会同时生成横向滚动条。
</script>
<style scoped>
.demo-scroll-panel-horizontal {
  width: 100%;
  padding: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}
.demo-content {
  display: inline-flex;
  gap: 16px;
}
.demo-card {
  flex-shrink: 0;
  width: 160px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
