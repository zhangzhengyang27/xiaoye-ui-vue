<template>
  <div class="demo-wrap">
    <xy-rich-text-editor
      ref="editorRef"
      v-model="content"
      placeholder="选中文本后点击工具栏的链接按钮..."
    >
      <template #default="{ editor: editorInstance, handlers }">
        <div v-if="editorInstance" class="demo-toolbar">
          <button
            class="demo-btn"
            :class="{ 'is-active': handlers.link.isActive(editorInstance) }"
            @click="openLinkPopover"
          >
            链接
          </button>
          <button
            v-if="handlers.link.isActive(editorInstance)"
            class="demo-btn"
            @click="handlers.link.execute(editorInstance, { href: '' }).run()"
          >
            移除链接
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
    <xy-editor-link-popover ref="popoverRef" :editor="editor" />
    <div class="demo-tip">
      提示：先选中一段文字，再点击"链接"按钮，会弹出独立 popover 输入 URL。默认 RichTextEditor
      已经内置了 EditorLinkPopover，此示例展示如何独立使用。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const content = ref('<p>选中"这段文字"，点击"链接"按钮，输入 URL。</p>');
const editorRef = ref<any>(null);

const editor = computed(() => editorRef.value?.editor);

const popoverRef = ref<any>(null);
const openLinkPopover = () => {
  popoverRef.value?.open();
};
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px 6px 0 0;
  border-bottom: none;
  flex-wrap: wrap;
}
.demo-btn {
  min-width: 32px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.demo-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}
.demo-btn.is-active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
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
