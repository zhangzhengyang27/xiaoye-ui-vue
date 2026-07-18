<template>
  <div class="demo-markdown-editor-wrap">
    <xy-markdown-editor v-model="content" :height="360" />
    <div class="demo-output">
      <div class="demo-output-title">绑定值（Markdown）：</div>
      <pre class="demo-output-code">{{ content || '（空）' }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref(`# 欢迎使用 XiaoyeUI MarkdownEditor

基于 [Vditor](https://github.com/Vanessa219/vditor) 的 Markdown 编辑器，支持以下特性：

- **即时渲染**（ir 模式）：类似 Typora，输入即渲染
- **所见即所得**（wysiwyg 模式）：对不熟悉 Markdown 的用户友好
- **分屏预览**（sv 模式）：左侧源码、右侧预览

## 语法示例

### 行内格式

支持 **加粗**、*斜体*、~~删除线~~、\`行内代码\`、[链接](https://github.com/Vanessa219/vditor)。

### 代码块

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

### 列表

1. 有序列表项 1
2. 有序列表项 2
   - 无序子项
   - 无序子项

### 任务列表

- [x] 已完成任务
- [ ] 未完成任务

### 引用

> 这是一段引用文本。
> 可以跨多行。

### 表格

| 属性 | 类型   | 默认值 |
| ---- | ------ | ------ |
| mode | string | 'ir'   |
| lang | string | zh_CN  |

### 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

开始编辑体验吧！
`);
</script>

<style scoped>
.demo-markdown-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
