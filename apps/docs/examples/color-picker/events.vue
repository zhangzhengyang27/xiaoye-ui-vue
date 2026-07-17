<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-color-picker-row">
      <span class="demo-label">颜色：</span>
      <xy-color-picker
        v-model="color"
        :default-color="defaultColor"
        @change="onChange"
        @show="onShow"
        @hide="onHide"
      />
    </div>
    <div class="demo-log">
      <div class="demo-log-title">事件日志：</div>
      <div v-if="!logs.length" class="demo-log-empty">尚无事件</div>
      <div v-for="(log, i) in logs" :key="i" class="demo-log-item">
        <span class="demo-log-time">{{ log.time }}</span>
        <span :class="['demo-log-tag', `demo-log-tag-${log.type}`]">{{ log.type }}</span>
        <span class="demo-log-text">{{ log.text }}</span>
      </div>
    </div>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('52c41a');
const defaultColor = ref('52c41a');

interface LogItem {
  time: string;
  type: 'change' | 'show' | 'hide';
  text: string;
}

const logs = ref<LogItem[]>([]);

const now = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });

const pushLog = (item: LogItem) => {
  logs.value.unshift(item);
  if (logs.value.length > 8) logs.value.pop();
};

const onChange = (e: any) => {
  pushLog({ time: now(), type: 'change', text: `value = ${JSON.stringify(e.value)}` });
};
const onShow = () => {
  pushLog({ time: now(), type: 'show', text: '面板已展开' });
};
const onHide = () => {
  pushLog({ time: now(), type: 'hide', text: '面板已关闭' });
};
</script>

<style scoped>
.demo-color-picker-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-label {
  font-size: 14px;
  color: #555;
}
.demo-log {
  width: 380px;
  max-height: 220px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
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
}
.demo-log-tag-change {
  background: #52c41a;
}
.demo-log-tag-show {
  background: #1890ff;
}
.demo-log-tag-hide {
  background: #8c8c8c;
}
.demo-log-text {
  color: #555;
  flex: 1;
  word-break: break-all;
}
</style>
