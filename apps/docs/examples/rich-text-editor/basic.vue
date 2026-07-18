<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="开始输入...">
      <template #default="{ editor, handlers }">
        <div v-if="editor" class="demo-toolbar">
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.bold.isActive(editor) }"
            :disabled="handlers.bold.isDisabled?.(editor)"
            title="加粗 (Ctrl+B)"
            @click="handlers.bold.execute(editor).run()"
          >
            B
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.italic.isActive(editor) }"
            :disabled="handlers.italic.isDisabled?.(editor)"
            title="斜体 (Ctrl+I)"
            @click="handlers.italic.execute(editor).run()"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.underline.isActive(editor) }"
            :disabled="handlers.underline.isDisabled?.(editor)"
            title="下划线 (Ctrl+U)"
            @click="handlers.underline.execute(editor).run()"
          >
            <u>U</u>
          </button>
          <span class="demo-divider"></span>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.bulletList.isActive(editor) }"
            title="无序列表"
            @click="handlers.bulletList.execute(editor).run()"
          >
            • 列表
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.orderedList.isActive(editor) }"
            title="有序列表"
            @click="handlers.orderedList.execute(editor).run()"
          >
            1. 列表
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
    <div class="demo-output">
      <div class="demo-output-title">绑定值（HTML）：</div>
      <pre class="demo-output-code">{{ content || '（空）' }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref(
  '<p>欢迎使用 <strong>XiaoyeUI RichTextEditor</strong>，基于 Tiptap 构建。</p><p>支持 <em>斜体</em>、<u>下划线</u>、列表等基础格式。</p>',
);
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
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
.demo-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.demo-divider {
  width: 1px;
  height: 20px;
  background: #e8e8e8;
  margin: 0 4px;
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
  max-height: 120px;
  overflow: auto;
  font-size: 12px;
  color: #555;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
