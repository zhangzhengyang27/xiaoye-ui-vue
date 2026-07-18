<template>
  <div class="inplace-custom-trigger">
    <p class="status">
      当前状态：{{ active ? '编辑中' : '展示中' }}（已切换 {{ toggleCount }} 次）
    </p>
    <xy-inplace v-model:active="active" :display-toggle-callback="beforeOpen">
      <template #display>
        <span class="display-text">{{ value }}</span>
      </template>
      <template #content="{ closeCallback }">
        <xy-input v-model:value="value" style="width: 200px" />
        <xy-button type="primary" size="small" @click="closeCallback">确定</xy-button>
      </template>
    </xy-inplace>
    <p class="tip">切换次数超过 3 次后将阻止进入编辑模式。</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

const active = ref(false);
const value = ref('点击编辑');
const toggleCount = ref(0);

// 切换前回调：返回 false 阻止进入编辑模式
function beforeOpen() {
  toggleCount.value += 1;
  if (toggleCount.value > 3) {
    message.warning('已达切换次数上限，禁止编辑');
    return false;
  }
  return true;
}
</script>

<style scoped>
.inplace-custom-trigger .status {
  margin-bottom: 8px;
  color: #666;
}
.inplace-custom-trigger .display-text {
  cursor: pointer;
  color: #1677ff;
}
.inplace-custom-trigger .tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}
.inplace-custom-trigger :deep(.xy-input) {
  margin-right: 8px;
}
</style>
