<template>
  <div class="demo-wrap">
    <div class="demo-row">
      <span class="demo-label">占位文本：</span>
      <xy-input v-model:value="placeholderText" style="width: 280px" />
    </div>
    <xy-rich-text-editor v-model="content" :placeholder="placeholderText || '请输入...'" />
    <p class="demo-tip">
      `placeholder` 支持字符串或对象形式。字符串形式直接显示文本；对象形式可配置
      `placeholder`、`mode`（'firstLine' / 'everyLine'）等选项。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const placeholderText = ref('在此输入你的想法...');
const content = ref('');
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-label {
  font-size: 14px;
  color: #555;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
