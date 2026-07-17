<template>
  <div class="demo-editor-wrap">
    <xy-editor
      v-model="content"
      placeholder="在此输入文字，观察右侧事件日志..."
      :editor-style="{ height: '200px' }"
      @text-change="onTextChange"
      @selection-change="onSelectionChange"
      @load="onLoad"
    />
    <div class="demo-log">
      <div class="demo-log-title">事件日志：</div>
      <div v-if="!logs.length" class="demo-log-empty">尚无事件</div>
      <div v-for="(log, i) in logs" :key="i" class="demo-log-item">
        <span class="demo-log-time">{{ log.time }}</span>
        <span :class="['demo-log-tag', `demo-log-tag-${log.type}`]">{{ log.type }}</span>
        <span class="demo-log-text">{{ log.text }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('');

interface LogItem {
  time: string;
  type: 'load' | 'text-change' | 'selection-change';
  text: string;
}

const logs = ref<LogItem[]>([]);

const now = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });

const pushLog = (item: LogItem) => {
  logs.value.unshift(item);
  if (logs.value.length > 10) logs.value.pop();
};

const onLoad = () => {
  pushLog({ time: now(), type: 'load', text: 'Quill 实例已加载' });
};
const onTextChange = (e: any) => {
  pushLog({
    time: now(),
    type: 'text-change',
    text: `source=${e.source}, text="${e.textValue?.slice(0, 20) ?? ''}"`,
  });
};
const onSelectionChange = (e: any) => {
  if (!e.range) return;
  pushLog({
    time: now(),
    type: 'selection-change',
    text: `range=[${e.range.index}, ${e.range.index + e.range.length}], source=${e.source}`,
  });
};
</script>

<style scoped>
.demo-editor-wrap {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.demo-log {
  width: 320px;
  max-height: 260px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
  flex-shrink: 0;
}
.demo-log-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}
.demo-log-empty {
  font-size: 12px;
  color: #ccc;
}
.demo-log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  border-bottom: 1px dashed #eee;
}
.demo-log-time {
  color: #999;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.demo-log-tag {
  padding: 1px 6px;
  border-radius: 3px;
  color: #fff;
  font-size: 11px;
  white-space: nowrap;
}
.demo-log-tag-load {
  background: #722ed1;
}
.demo-log-tag-text-change {
  background: #52c41a;
}
.demo-log-tag-selection-change {
  background: #1890ff;
}
.demo-log-text {
  color: #555;
  flex: 1;
  word-break: break-all;
}
</style>
