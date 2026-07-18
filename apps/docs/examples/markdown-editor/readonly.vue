<template>
  <div class="demo-markdown-editor-wrap">
    <div class="demo-controls">
      <xy-switch v-model:checked="readonly" />
      只读模式
    </div>
    <xy-markdown-editor v-model="content" :readonly="readonly" :height="320" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const readonly = ref(false);
const content = ref(`# 只读模式示例

切换上方的开关，可以在编辑/只读之间切换。

只读模式下：
- 内容不可修改
- 工具栏按钮禁用
- 适合内容预览场景

## 不可修改的内容

\`\`\`javascript
console.log('只读模式下此代码块不可编辑');
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
