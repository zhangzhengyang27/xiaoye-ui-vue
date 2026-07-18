<template>
  <div class="demo-wrap">
    <xy-rich-text-editor
      ref="editorRef"
      v-model="content"
      placeholder="选中一段文字，会浮现 bubble 工具栏..."
    >
      <template #default="{ editor }">
        <xy-rich-text-editor-toolbar
          v-if="editor"
          :editor="editor"
          :items="items"
          layout="bubble"
          :should-show="shouldShow"
        />
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">提示：在编辑器中输入文字后，用鼠标选中一段文字，会自动浮出工具栏。</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { defaultToolbarItems } from 'xiaoye-ui/rich-text-editor';

const content = ref('<p>尝试<strong>选中这段文字</strong>，会浮现 bubble 工具栏。</p>');
const items = defaultToolbarItems;

// shouldShow：选中文本且非空时显示
const shouldShow = ({ editor }: { editor: any }) => {
  const { view, state } = editor;
  const { from, to, empty } = view.state.selection;
  if (empty) return false;
  // 仅在选中文本（非节点选择）时显示
  const text = state.doc.textBetween(from, to, ' ');
  return text.length > 0;
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
