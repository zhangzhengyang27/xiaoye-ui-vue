<template>
  <xy-space :size="48" align="center">
    <!-- 头像徽标：超过 99 自动显示 99+（OverlayBadge 默认 overflowCount=99） -->
    <xy-overlay-badge :value="unread" class="avatar-badge" @click="handleClear">
      <xy-avatar :size="56" src="https://joeschmoe.io/api/v1/random" alt="用户头像" />
    </xy-overlay-badge>

    <xy-overlay-badge :value="messageCount" class="avatar-badge" @click="messageCount = 0">
      <xy-avatar :size="56" src="https://joeschmoe.io/api/v1/random" alt="用户头像" />
    </xy-overlay-badge>

    <!-- 文本徽标 -->
    <xy-overlay-badge value="NEW" class="avatar-badge" @click="handleTextClick">
      <xy-avatar :size="56" src="https://joeschmoe.io/api/v1/random" alt="用户头像" />
    </xy-overlay-badge>

    <!-- 控制面板 -->
    <xy-card size="small" class="control-panel">
      <template #title>未读消息模拟</template>
      <xy-space direction="vertical" :size="8" style="width: 100%">
        <xy-typography-text>
          当前未读：
          <xy-typography-text strong type="danger">{{ unread }}</xy-typography-text>
          条
        </xy-typography-text>
        <xy-space :size="8">
          <xy-button size="small" @click="unread += 5">+5 未读</xy-button>
          <xy-button size="small" type="primary" @click="handleClear">已读清零</xy-button>
        </xy-space>
        <xy-typography-text type="secondary" style="font-size: 12px">
          提示：点击徽标 / 头像可清零未读数；超过 99 自动显示为 99+。
        </xy-typography-text>
      </xy-space>
    </xy-card>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

const unread = ref<number>(108);
const messageCount = ref<number>(6);

const handleClear = () => {
  if (unread.value === 0) {
    message.info('当前已无未读消息');
    return;
  }
  unread.value = 0;
  message.success('未读消息已全部标记为已读');
};

const handleTextClick = () => {
  message.info('NEW 徽标点击');
};
</script>

<style scoped>
.avatar-badge {
  cursor: pointer;
  display: inline-block;
}
.control-panel {
  width: 280px;
}
</style>
