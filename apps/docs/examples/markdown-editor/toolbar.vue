<template>
  <div class="demo-markdown-editor-wrap">
    <xy-markdown-editor v-model="content" :height="360" :toolbar="toolbar" />
    <div class="demo-tip">
      当前工具栏仅包含：表情、加粗、斜体、删除线、分隔符、引用、无序列表、链接、代码、全屏。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref(`# 自定义工具栏

通过 \`toolbar\` 属性可自定义工具栏按钮组合，仅保留需要的功能。

可用 name 参见 [Vditor 文档](https://ld246.com/article/1582778815353)，常用 name：

- \`emoji\` 表情
- \`headings\` 标题
- \`bold\` / \`italic\` / \`strike\` 加粗/斜体/删除线
- \`|\` 分隔符
- \`line\` 分割线
- \`quote\` 引用
- \`list\` / \`ordered-list\` / \`check\` 列表
- \`code\` / \`inline-code\` 代码
- \`link\` / \`table\` / \`upload\` 链接/表格/上传
- \`undo\` / \`redo\` 撤销/重做
- \`fullscreen\` / \`outline\` / \`preview\` 全屏/大纲/预览
`);

const toolbar = ref([
  'emoji',
  'headings',
  'bold',
  'italic',
  'strike',
  '|',
  'line',
  'quote',
  'list',
  'ordered-list',
  'check',
  '|',
  'link',
  'table',
  '|',
  'code',
  'inline-code',
  '|',
  'undo',
  'redo',
  '|',
  'fullscreen',
  'preview',
]);
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
}
</style>
