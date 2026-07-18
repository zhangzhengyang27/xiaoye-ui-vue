<template>
  <div class="demo-markdown-editor-wrap">
    <div class="demo-controls">
      <xy-button type="primary" @click="handleGetValue">获取当前值</xy-button>
      <xy-button @click="handleSetValue">设置新值</xy-button>
      <xy-button @click="handleGetHtml">获取 HTML</xy-button>
    </div>
    <xy-markdown-editor ref="editorRef" :default-value="defaultValue" :height="320" />
    <div class="demo-output">
      <div class="demo-output-title">通过 ref.getValue() / getHTML() 获取的内容：</div>
      <pre class="demo-output-code">{{ output || '（点击上方按钮获取内容）' }}</pre>
    </div>
    <div class="demo-tip">
      非受控模式：使用
      <code>default-value</code>
      设置初始内容，不使用
      <code>v-model</code>
      ， 组件内部管理状态。父组件无需维护
      <code>content</code>
      变量， 通过
      <code>ref.getValue()</code>
      /
      <code>ref.setValue()</code>
      主动读取或写入。 适合不需要实时同步内容的场景，性能更优。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const editorRef = ref<any>(null);
const output = ref('');

// 非受控模式：仅设置初始值，组件内部管理状态
const defaultValue = ref(`# 非受控模式

本示例使用 \`default-value\` 设置初始内容，未使用 \`v-model\`。

- 点击「获取当前值」：通过 \`ref.getValue()\` 获取 Markdown 源码
- 点击「设置新值」：通过 \`ref.setValue()\` 写入新内容
- 点击「获取 HTML」：通过 \`ref.getHTML()\` 获取渲染后的 HTML

对比受控模式（v-model）：父组件需要维护 \`content\` ref 并通过 v-model 同步。`);

function handleGetValue() {
  output.value = editorRef.value?.getValue() ?? '';
}

function handleSetValue() {
  const newContent = `# 已设置新内容

通过 \`ref.setValue()\` 在 ${new Date().toLocaleTimeString('zh-CN', { hour12: false })} 写入。

非受控模式下，父组件无需维护 content 状态，仅在需要时主动读取。
- 优点：减少双向绑定开销，性能更优
- 适用：表单提交时一次性读取、不需要实时同步的场景
`;
  editorRef.value?.setValue(newContent);
  // 设置后立即读取以展示结果
  output.value = editorRef.value?.getValue() ?? '';
}

function handleGetHtml() {
  output.value = editorRef.value?.getHTML() ?? '';
}
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
  flex-wrap: wrap;
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
.demo-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.6;
}
.demo-tip code {
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
