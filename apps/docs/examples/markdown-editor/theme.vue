<template>
  <div class="demo-markdown-editor-wrap">
    <div class="demo-controls">
      <span>主题：</span>
      <xy-radio-group v-model:value="theme" button-style="solid">
        <xy-radio-button value="classic">浅色 (classic)</xy-radio-button>
        <xy-radio-button value="dark">深色 (dark)</xy-radio-button>
      </xy-radio-group>
    </div>

    <div class="demo-controls">
      <span>打字机模式：</span>
      <xy-switch v-model:checked="typewriterMode" />
      <span class="demo-control-divider" />
      <span>调试日志：</span>
      <xy-switch v-model:checked="debug" />
    </div>

    <!-- 切换主题/关键配置时通过 :key 强制重建实例 -->
    <xy-markdown-editor
      :key="`${theme}-${typewriterMode}-${debug}`"
      v-model="content"
      :theme="theme"
      :typewriter-mode="typewriterMode"
      :debug="debug"
      :height="360"
    />

    <div class="demo-tip">
      切换主题时通过
      <code>:key</code>
      强制重建编辑器实例，保证所有子资源（CSS、代码主题等）正确加载；
      若需要在不重建实例的情况下动态切换主题，可通过
      <code>ref</code>
      调用
      <code>setTheme(theme, contentTheme, codeTheme)</code>
      方法。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { MarkdownEditorTheme } from 'xiaoye-ui/markdown-editor';

const theme = ref<MarkdownEditorTheme>('classic');
const typewriterMode = ref(false);
const debug = ref(false);

const content = ref(`# 主题切换示例

切换上方单选按钮，可在浅色 / 深色主题之间切换。

## 代码块（dark 主题下效果更明显）

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

## 引用

> 这是一段引用文本。
> 深色主题下引用块会有不同的背景色与边框。

## 列表

- 无序列表项 1
- 无序列表项 2
  - 嵌套子项
- 无序列表项 3

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

## 表格

| 属性   | 类型   | 默认值   |
| ------ | ------ | -------- |
| theme  | string | 'classic' |
| icon   | string | 'ant'    |
| debug  | boolean| false    |

## 强调

支持 **加粗**、*斜体*、~~删除线~~、\`行内代码\`、[链接](https://github.com/Vanessa219/vditor)。

切换「打字机模式」后，当前输入行会始终保持在视口中央，适合长文写作。
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
.demo-control-divider {
  display: inline-block;
  width: 24px;
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
