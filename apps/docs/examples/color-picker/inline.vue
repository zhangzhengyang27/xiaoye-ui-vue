<template>
  <div class="demo-inline-wrap">
    <div class="demo-inline-card">
      <h4>内联模式</h4>
      <xy-color-picker v-model="color" inline :default-color="defaultColor" />
      <p class="demo-value">当前值：{{ color }}</p>
    </div>
    <div class="demo-inline-card">
      <h4>弹出模式</h4>
      <xy-color-picker v-model="color" :default-color="defaultColor" />
      <p class="demo-value">当前值：{{ color }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('722ed1');
const defaultColor = ref('722ed1');
</script>

<style scoped>
.demo-inline-wrap {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.demo-inline-card {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}
.demo-inline-card h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.demo-value {
  margin: 12px 0 0;
  font-size: 13px;
  color: #1890ff;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
