<!-- 异步加载场景：点击 switch 后延迟切换，期间显示 loading，失败时回滚并提示 -->
<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-async-row">
      <span class="demo-label">异步保存：</span>
      <xy-switch :checked="checked" :loading="loading" @change="onChange" />
      <span class="demo-status">{{ statusText }}</span>
    </div>
    <p class="demo-tip">
      点击开关后模拟 1.5 秒保存延迟，期间显示 loading；约 30% 概率失败，失败时回滚状态并提示错误。
    </p>
  </xy-space>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { message } from 'xiaoye-ui';

const checked = ref<boolean>(false);
const loading = ref<boolean>(false);

const statusText = computed(() => {
  if (loading.value) return '保存中...';
  return checked.value ? '已开启' : '已关闭';
});

const onChange = (val: boolean | string | number) => {
  // 保存进行中时忽略后续点击
  if (loading.value) return;
  const next = Boolean(val);
  loading.value = true;
  // 模拟异步保存请求
  setTimeout(() => {
    const failed = Math.random() < 0.3;
    if (failed) {
      message.error('保存失败，已回滚');
    } else {
      checked.value = next;
      message.success(`已${next ? '开启' : '关闭'}`);
    }
    loading.value = false;
  }, 1500);
};
</script>

<style scoped>
.demo-async-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-label {
  font-size: 14px;
  color: #555;
}
.demo-status {
  font-size: 13px;
  color: #1890ff;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
