<template>
  <div class="demo-editor-wrap">
    <xy-editor v-model="content" :editor-style="{ height: '220px' }">
      <template #toolbar>
        <span class="ql-formats">
          <button class="ql-bold" type="button" title="加粗"></button>
          <button class="ql-italic" type="button" title="斜体"></button>
          <button class="ql-underline" type="button" title="下划线"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-list" value="ordered" type="button" title="有序列表"></button>
          <button class="ql-list" value="bullet" type="button" title="无序列表"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-link" type="button" title="链接"></button>
          <button class="ql-clean" type="button" title="清除格式"></button>
        </span>
      </template>
    </xy-editor>
    <p class="demo-tip">
      通过 `#toolbar` 插槽可自定义工具栏按钮，仅保留需要的格式按钮。按钮需使用 Quill 的 `ql-*`
      类名。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('<p>自定义工具栏示例：仅包含加粗、斜体、下划线、列表、链接和清除格式。</p>');
</script>

<style scoped>
.demo-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
