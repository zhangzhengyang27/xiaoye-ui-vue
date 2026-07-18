<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="输入 / 触发斜杠命令菜单...">
      <template #default="{ editor }">
        <xy-rich-text-editor-suggestion-menu
          v-if="editor"
          :editor="editor"
          :items="items"
          :char="'/'"
        />
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">
      提示：在编辑器中输入
      <code>/</code>
      会弹出斜杠命令菜单。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('<p>开始输入，输入 / 召唤斜杠命令菜单。</p>');

// 斜杠命令 items
const items = [
  [
    { type: 'label', label: '基础块' },
    { kind: 'heading', level: 1, label: '标题 1', description: '大标题', icon: 'H1' },
    { kind: 'heading', level: 2, label: '标题 2', description: '中标题', icon: 'H2' },
    { kind: 'heading', level: 3, label: '标题 3', description: '小标题', icon: 'H3' },
    { kind: 'paragraph', label: '正文', description: '普通段落' },
  ],
  [
    { type: 'label', label: '列表' },
    { kind: 'bulletList', label: '无序列表', description: '项目符号列表' },
    { kind: 'orderedList', label: '有序列表', description: '编号列表' },
    { kind: 'taskList', label: '任务列表', description: '可勾选的任务列表' },
  ],
  [
    { type: 'label', label: '高级' },
    { kind: 'blockquote', label: '引用', description: '引用文本块' },
    { kind: 'codeBlock', label: '代码块', description: '代码语法高亮' },
    { kind: 'horizontalRule', label: '分割线', description: '插入水平分割线' },
    { kind: 'image', label: '图片', description: '插入图片' },
    { kind: 'insertTable', label: '表格', description: '插入表格' },
  ],
];
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-tip {
  font-size: 12px;
  color: #999;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}
.demo-tip code {
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: #c41d7f;
}
</style>
