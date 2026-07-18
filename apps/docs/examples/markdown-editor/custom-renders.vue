<template>
  <div class="demo-markdown-editor-wrap">
    <xy-markdown-editor v-model="content" :custom-renders="customRenders" :height="380" />
    <div class="demo-tip">
      通过
      <code>customRenders</code>
      可自定义特定语言代码块的渲染： 每项配置
      <code>{ language, render(element, vditor) }</code>
      ， 在
      <code>render</code>
      中可任意操作 DOM。本示例注册了
      <code>mermaid</code>
      与
      <code>ad-card</code>
      两个自定义语言，可集成 mermaid.js、流程图、广告位等。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 自定义渲染器：根据代码块语言自定义渲染结果
const customRenders = [
  {
    language: 'mermaid',
    render: (element: HTMLElement) => {
      element.innerHTML =
        '<div style="padding:16px;background:#f6f8fa;border-radius:4px;color:#666;text-align:center;">🎨 Mermaid 图表渲染区（自定义渲染）<br/><small>此处可集成 mermaid.js 渲染流程图</small></div>';
    },
  },
  {
    language: 'ad-card',
    render: (element: HTMLElement) => {
      element.innerHTML =
        '<div style="padding:12px 16px;border:1px dashed #1890ff;border-radius:6px;background:#e6f7ff;color:#1890ff;">📢 自定义广告卡片（customRenders 演示）</div>';
    },
  },
];

const content = ref(`# 自定义渲染

\`customRenders\` 用于自定义特定语言代码块的渲染结果，可集成 mermaid.js、流程图、广告位等。

## Mermaid 自定义渲染

\`\`\`mermaid
graph TD
  A[开始] --> B{条件判断}
  B -->|是| C[执行操作]
  B -->|否| D[结束]
\`\`\`

## 广告卡片自定义渲染

\`\`\`ad-card
此处内容会被自定义渲染器替换为广告卡片。
\`\`\`

## 普通代码块（不受影响）

\`\`\`javascript
console.log('普通代码块仍按默认高亮渲染');
\`\`\`
`);
</script>

<style scoped>
.demo-markdown-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
