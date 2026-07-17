<template>
  <xy-context-menu
    :model="items"
    global
    @before-show="onBeforeShow"
    @show="onShow"
    @before-hide="onBeforeHide"
    @hide="onHide"
  />
  <div class="context-menu-events-area">右键点击触发事件，查看下方日志</div>
  <div class="context-menu-log">
    <div class="context-menu-log-title">事件日志：</div>
    <div v-if="logs.length === 0" class="context-menu-log-empty">暂无日志</div>
    <div v-for="(log, index) in logs" :key="index" class="context-menu-log-item">
      <span class="context-menu-log-time">{{ log.time }}</span>
      <span class="context-menu-log-type" :class="`is-${log.type}`">{{ log.type }}</span>
      <span class="context-menu-log-text">{{ log.text }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { MenuItem } from 'xiaoye-ui';

interface LogItem {
  time: string;
  type: string;
  text: string;
}

const logs = ref<LogItem[]>([]);

const addLog = (type: string, text: string) => {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  logs.value.unshift({ time, type, text });
  if (logs.value.length > 6) {
    logs.value.pop();
  }
};

const onBeforeShow = () => {
  addLog('before-show', '菜单即将显示');
};
const onShow = () => {
  addLog('show', '菜单已显示');
};
const onBeforeHide = () => {
  addLog('before-hide', '菜单即将隐藏');
};
const onHide = () => {
  addLog('hide', '菜单已隐藏');
};

const items: MenuItem[] = [
  {
    label: '复制',
    command: ({ item }) => {
      addLog('command', `点击了「${item.label}」`);
    },
  },
  {
    label: '粘贴',
    command: ({ item }) => {
      addLog('command', `点击了「${item.label}」`);
    },
  },
  {
    separator: true,
  },
  {
    label: '全选',
    command: ({ item }) => {
      addLog('command', `点击了「${item.label}」`);
    },
  },
  {
    label: '清空日志',
    command: () => {
      logs.value = [];
    },
  },
];
</script>

<style scoped>
.context-menu-events-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: #f7f7f7;
  color: #777;
  border-radius: 4px;
  margin-bottom: 16px;
}
.context-menu-log {
  padding: 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  min-height: 160px;
  max-height: 200px;
  overflow-y: auto;
}
.context-menu-log-title {
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}
.context-menu-log-empty {
  color: #999;
}
.context-menu-log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 13px;
  border-bottom: 1px dashed #f0f0f0;
}
.context-menu-log-time {
  color: #999;
  font-family: monospace;
}
.context-menu-log-type {
  padding: 1px 6px;
  border-radius: 2px;
  font-size: 12px;
  background: #e6f4ff;
  color: #1677ff;
}
.context-menu-log-type.is-show,
.context-menu-log-type.is-before-show {
  background: #f6ffed;
  color: #52c41a;
}
.context-menu-log-type.is-hide,
.context-menu-log-type.is-before-hide {
  background: #fff7e6;
  color: #fa8c16;
}
.context-menu-log-type.is-command {
  background: #fff1f0;
  color: #ff4d4f;
}
.context-menu-log-text {
  color: #333;
}
</style>
