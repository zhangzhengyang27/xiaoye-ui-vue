<template>
  <div class="tabs-badge-wrapper">
    <xy-tabs v-model:active-key="activeKey">
      <xy-tab-pane key="inbox">
        <template #tab>
          <xy-overlay-badge :value="counts.inbox" class="tab-badge badge-success">
            <span class="tab-label">收件箱</span>
          </xy-overlay-badge>
        </template>
        <xy-empty :description="`收件箱：${counts.inbox} 封未读`" />
      </xy-tab-pane>

      <xy-tab-pane key="todo">
        <template #tab>
          <xy-overlay-badge :value="counts.todo" class="tab-badge badge-warning">
            <span class="tab-label">待办</span>
          </xy-overlay-badge>
        </template>
        <xy-empty :description="`待办：${counts.todo} 项`" />
      </xy-tab-pane>

      <xy-tab-pane key="error">
        <template #tab>
          <xy-overlay-badge :value="counts.error" class="tab-badge badge-error">
            <span class="tab-label">异常</span>
          </xy-overlay-badge>
        </template>
        <xy-empty :description="`异常：${counts.error} 条告警`" />
      </xy-tab-pane>

      <xy-tab-pane key="done">
        <template #tab>
          <xy-overlay-badge :value="counts.done" class="tab-badge badge-info">
            <span class="tab-label">已完成</span>
          </xy-overlay-badge>
        </template>
        <xy-empty :description="`已完成：${counts.done} 项任务`" />
      </xy-tab-pane>
    </xy-tabs>

    <xy-divider />

    <xy-space :size="8">
      <xy-button size="small" @click="randomize">随机变更徽标数</xy-button>
      <xy-button size="small" type="primary" @click="markCurrentRead">标记当前 Tab 已读</xy-button>
      <xy-typography-text type="secondary" style="font-size: 12px">
        切换 Tab 后点击「标记当前 Tab 已读」可清零对应徽标
      </xy-typography-text>
    </xy-space>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

const activeKey = ref<string>('inbox');
const counts = ref({
  inbox: 8,
  todo: 3,
  error: 12,
  done: 24,
});

const tabNameMap: Record<string, string> = {
  inbox: '收件箱',
  todo: '待办',
  error: '异常',
  done: '已完成',
};

const randomize = () => {
  counts.value = {
    inbox: Math.floor(Math.random() * 100),
    todo: Math.floor(Math.random() * 30),
    error: Math.floor(Math.random() * 20),
    done: Math.floor(Math.random() * 60),
  };
};

const markCurrentRead = () => {
  const key = activeKey.value as keyof typeof counts.value;
  if (counts.value[key] === 0) {
    message.info(`${tabNameMap[key]} 已无未读`);
    return;
  }
  counts.value[key] = 0;
  message.success(`已标记 ${tabNameMap[key]} 为已读`);
};
</script>

<style scoped>
.tabs-badge-wrapper {
  width: 100%;
}
.tab-badge {
  display: inline-flex;
  align-items: center;
}
.tab-label {
  padding: 0 12px;
  line-height: 36px;
}
/* 不同状态徽标颜色（通过 :deep() 覆盖底层 .xy-badge-count 的背景色） */
.tab-badge.badge-success :deep(.xy-badge-count) {
  background: #52c41a;
}
.tab-badge.badge-warning :deep(.xy-badge-count) {
  background: #faad14;
}
.tab-badge.badge-error :deep(.xy-badge-count) {
  background: #ff4d4f;
}
.tab-badge.badge-info :deep(.xy-badge-count) {
  background: #1677ff;
}
</style>
