<template>
  <div class="demo-markdown-editor-wrap">
    <div class="demo-controls">
      <span>值格式：</span>
      <xy-radio-group v-model:value="valueFormat" button-style="solid">
        <xy-radio-button value="markdown">Markdown 源码</xy-radio-button>
        <xy-radio-button value="html">渲染后 HTML</xy-radio-button>
      </xy-radio-group>
    </div>
    <xy-markdown-editor
      :key="valueFormat"
      v-model="content"
      :value-format="valueFormat"
      :height="300"
    />
    <div class="demo-output">
      <div class="demo-output-title">
        v-model 绑定值（{{ valueFormat === 'markdown' ? 'Markdown' : 'HTML' }}）：
      </div>
      <pre class="demo-output-code">{{ content || '（空）' }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const valueFormat = ref<'markdown' | 'html'>('markdown');
const content = ref(`# 值格式切换

切换上方单选按钮，可以看到 \`v-model\` 绑定的值在 **Markdown 源码** 与 **渲染后的 HTML** 之间切换。

- \`valueFormat="markdown"\`：绑定值为 Markdown 原文，便于存储和迁移
- \`valueFormat="html"\`：绑定值为渲染后的 HTML，可直接展示

支持 **加粗**、*斜体*、\`行内代码\` 等格式。
`);
</script>

<style scoped>
.demo-markdown-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.demo-output {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 12px;
  background: #fafafa;
}
.demo-output-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}
.demo-output-code {
  margin: 0;
  max-height: 200px;
  overflow: auto;
  font-size: 12px;
  color: #555;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
