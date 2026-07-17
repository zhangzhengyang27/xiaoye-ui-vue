<template>
  <div class="demo-wrap">
    <div class="demo-row">
      <xy-switch v-model:checked="disabled" />
      <span class="demo-row-text">disabled = {{ disabled }}</span>
      <span class="demo-row-hint">（编辑器{{ disabled ? '已禁用' : '可编辑' }}）</span>
    </div>
    <xy-rich-text-editor
      v-model="content"
      :disabled="disabled"
      placeholder="切换开关改变可编辑状态"
    >
      <template #default="{ editor, handlers }">
        <div v-if="editor" class="demo-toolbar">
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.bold.isActive(editor) }"
            :disabled="disabled || handlers.bold.isDisabled?.(editor)"
            @click="handlers.bold.execute(editor).run()"
          >
            B
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.italic.isActive(editor) }"
            :disabled="disabled || handlers.italic.isDisabled?.(editor)"
            @click="handlers.italic.execute(editor).run()"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.underline.isActive(editor) }"
            :disabled="disabled || handlers.underline.isDisabled?.(editor)"
            @click="handlers.underline.execute(editor).run()"
          >
            <u>U</u>
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
    <p class="demo-tip">
      通过 `disabled` 属性可切换编辑器的可编辑状态。禁用后内容不可修改，工具栏按钮也应同步禁用。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const disabled = ref(false);
const content = ref('<p>切换上方的开关，观察编辑器的可编辑状态变化。</p>');
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-row-text {
  font-size: 13px;
  color: #555;
}
.demo-row-hint {
  font-size: 12px;
  color: #999;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px 6px 0 0;
  border-bottom: none;
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
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
