<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-color-picker-row">
      <span class="demo-label">启用：</span>
      <xy-color-picker v-model="color1" :default-color="defaultColor" />
    </div>
    <div class="demo-color-picker-row">
      <span class="demo-label">禁用：</span>
      <xy-color-picker v-model="color2" disabled :default-color="defaultColor" />
    </div>
    <p class="demo-tip">设置 `disabled` 属性后，预览框不可点击，无法打开颜色面板。</p>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const color1 = ref('13c2c2');
const color2 = ref('fa8c16');
const defaultColor = ref('13c2c2');
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
  width: 48px;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
