<template>
  <div class="demo-editor-wrap">
    <xy-editor v-model="content" :editor-style="{ height: '240px' }" />
    <div class="demo-output">
      <div class="demo-output-title">绑定值（HTML）：</div>
      <pre class="demo-output-code">{{ content || '（空）' }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref(
  '<h2>欢迎使用 XiaoyeUI Editor</h2><p>这是一个基于 Quill 的富文本编辑器，支持 <strong>加粗</strong>、<em>斜体</em>、<u>下划线</u>、列表、链接等格式。</p>',
);
</script>

<style scoped>
.demo-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  max-height: 160px;
  overflow: auto;
  font-size: 12px;
  color: #555;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
