<template>
  <div class="demo-markdown-editor-wrap">
    <xy-markdown-editor
      v-model="content"
      :height="320"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
      @esc="onEsc"
      @ctrlEnter="onCtrlEnter"
      @select="onSelect"
      @after="onAfter"
    />
    <div class="demo-output">
      <div class="demo-output-title">事件日志：</div>
      <pre class="demo-output-code">{{ logs.join('\n') || '（暂无事件，请点击编辑器交互）' }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('# 事件处理示例\n\n在编辑器中输入、点击、按键，下方会实时记录触发的事件。');
const logs = ref<string[]>([]);

function pushLog(text: string) {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  logs.value.unshift(`[${time}] ${text}`);
  if (logs.value.length > 20) logs.value.pop();
}

function onInput(value: string) {
  pushLog(`input: ${truncate(value)}`);
}
function onFocus(value: string) {
  pushLog(`focus: ${truncate(value)}`);
}
function onBlur(value: string) {
  pushLog(`blur: ${truncate(value)}`);
}
function onKeydown(event: KeyboardEvent) {
  pushLog(`keydown: ${event.key}`);
}
function onEsc(value: string) {
  pushLog(`esc: ${truncate(value)}`);
}
function onCtrlEnter(value: string) {
  pushLog(`ctrlEnter: ${truncate(value)}`);
}
function onSelect(value: string) {
  pushLog(`select: ${truncate(value)}`);
}
function onAfter() {
  pushLog(`after: Vditor 实例已就绪`);
}

function truncate(value: string) {
  const text = (value || '').replace(/\n/g, '\\n');
  return text.length > 30 ? `${text.slice(0, 30)}...` : text;
}
</script>

<style scoped>
.demo-markdown-editor-wrap {
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
  max-height: 200px;
  overflow: auto;
  font-size: 12px;
  color: #555;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
