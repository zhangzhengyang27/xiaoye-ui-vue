<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-row">
      <span class="demo-label">仅正整数（pint）：</span>
      <xy-key-filter preset="pint">
        <input v-model="value" class="demo-input" placeholder="只能输入 0-9 数字" />
      </xy-key-filter>
    </div>
    <p class="demo-tip">使用 `preset="pint"` 限制输入框只能输入数字字符，其他按键将被拦截。</p>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref('');
</script>

<style scoped>
.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-label {
  font-size: 14px;
  color: #555;
  width: 160px;
}
.demo-input {
  width: 240px;
  height: 32px;
  padding: 4px 11px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}
.demo-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
