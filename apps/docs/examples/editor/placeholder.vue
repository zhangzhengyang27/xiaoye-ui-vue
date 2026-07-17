<template>
  <div class="demo-editor-wrap">
    <div class="demo-row">
      <xy-button @click="clearContent">清空内容</xy-button>
      <xy-button type="primary" @click="fillContent">填入内容</xy-button>
    </div>
    <xy-editor
      v-model="content"
      placeholder="请输入正文内容，支持富文本格式..."
      :editor-style="{ height: '200px' }"
    />
    <p class="demo-tip">
      当编辑器内容为空时，会显示 `placeholder` 指定的占位文本；输入内容后占位文本自动消失。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('');

const clearContent = () => {
  content.value = '';
};
const fillContent = () => {
  content.value = '<p>已填入示例内容，占位文本将不再显示。</p>';
};
</script>

<style scoped>
.demo-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-row {
  display: flex;
  gap: 8px;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
