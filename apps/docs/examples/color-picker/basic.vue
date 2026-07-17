<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-color-picker-row">
      <span class="demo-label">当前颜色：</span>
      <xy-color-picker v-model="color" />
      <span class="demo-value">{{ color }}</span>
    </div>
    <p class="demo-tip">点击左侧预览框打开颜色面板，拖动色块选择颜色，右侧实时显示当前 HEX 值。</p>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('1890ff');
</script>

<style scoped>
.demo-color-picker-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-label {
  font-size: 14px;
  color: #555;
}
.demo-value {
  font-size: 14px;
  color: #1890ff;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
