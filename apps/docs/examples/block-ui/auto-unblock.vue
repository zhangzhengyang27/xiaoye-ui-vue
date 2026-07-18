<template>
  <div class="block-ui-auto-unblock">
    <div class="toolbar">
      <xy-button type="primary" :disabled="blocked" @click="startAutoUnblock">
        {{ blocked ? '阻塞中...' : '开始阻塞 3 秒' }}
      </xy-button>
      <xy-button @click="cancelAutoUnblock">取消计时</xy-button>
    </div>

    <xy-block-ui :blocked="blocked" :tip="tip">
      <div class="content">
        <p>点击「开始阻塞 3 秒」后，容器会进入阻塞状态，并在 3 秒后自动解除。</p>
        <p>实际业务中常用于：发起请求时阻塞，请求返回后自动解除。</p>
      </div>
    </xy-block-ui>

    <p class="status">当前状态：{{ blocked ? '阻塞中' : '已解除' }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue';

const blocked = ref<boolean>(false);
const tip = ref<string>('请稍候 3 秒...');
let timer: ReturnType<typeof setTimeout> | null = null;

function startAutoUnblock() {
  blocked.value = true;
  timer = setTimeout(() => {
    blocked.value = false;
    timer = null;
  }, 3000);
}

function cancelAutoUnblock() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  blocked.value = false;
}

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
});
</script>

<style scoped>
.block-ui-auto-unblock {
  width: 100%;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.content {
  padding: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
  min-height: 120px;
}
.status {
  margin-top: 16px;
  color: #888;
}
</style>
