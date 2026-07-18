<template>
  <div class="demo-wrap">
    <xy-rich-text-editor
      v-model="content"
      placeholder="在新的一行空行处，会浮现 floating 工具栏..."
    >
      <template #default="{ editor }">
        <xy-rich-text-editor-toolbar
          v-if="editor"
          :editor="editor"
          :items="items"
          layout="floating"
          :should-show="shouldShow"
        />
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">提示：在编辑器中新建一行后清空内容，会自动浮出 floating 工具栏。</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { defaultToolbarItems } from 'xiaoye-ui/rich-text-editor';

const content = ref('<p>开始输入...</p>');

// 简化 items：只保留块类型（第 2 组）和文本格式（第 3 组）
const items = [defaultToolbarItems[1], defaultToolbarItems[2]];

// shouldShow：当前是空段落时显示 floating 工具栏
const shouldShow = ({ editor }: { editor: any }) => {
  const { state } = editor;
  const { selection } = state;
  const $from = selection.$from;
  // 当前段落为空时显示
  return $from.parent.content.size === 0 && selection.empty;
};
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
</style>
