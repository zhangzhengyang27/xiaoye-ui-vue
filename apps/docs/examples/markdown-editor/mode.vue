<template>
  <div class="demo-markdown-editor-wrap">
    <div class="demo-controls">
      <span>编辑模式：</span>
      <xy-radio-group v-model:value="mode" button-style="solid">
        <xy-radio-button value="ir">即时渲染 (IR)</xy-radio-button>
        <xy-radio-button value="wysiwyg">所见即所得 (WYSIWYG)</xy-radio-button>
        <xy-radio-button value="sv">分屏预览 (SV)</xy-radio-button>
      </xy-radio-group>
    </div>
    <xy-markdown-editor ref="editorRef" :key="mode" v-model="content" :mode="mode" :height="360" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const mode = ref<'ir' | 'wysiwyg' | 'sv'>('ir');
const editorRef = ref();
const content = ref(`# 编辑模式对比

## IR（即时渲染）
输入 Markdown 语法后立即渲染为富文本样式，类似 Typora。例如输入 \`## 标题\` 后会立即变成标题样式。

## WYSIWYG（所见即所得）
对不熟悉 Markdown 的用户友好，工具栏操作直接生效。

## SV（分屏预览）
左侧显示 Markdown 源码，右侧显示渲染结果，适合传统 Markdown 用户。

切换上方单选按钮体验不同模式。

\`\`\`python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\`
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
</style>
