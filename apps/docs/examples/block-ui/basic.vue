<template>
  <div class="block-ui-basic">
    <xy-block-ui :blocked="blocked">
      <div class="block-ui-target">
        <p>这是一个被阻塞的容器。点击下方按钮切换阻塞状态。</p>
        <p>阻塞期间，容器内部将无法被点击或选中。</p>
        <xy-button type="primary" @click="onInnerClick">内部按钮</xy-button>
      </div>
    </xy-block-ui>

    <div class="block-ui-actions">
      <xy-button @click="toggle">{{ blocked ? '解除阻塞' : '阻塞容器' }}</xy-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

const blocked = ref<boolean>(false);

function toggle() {
  blocked.value = !blocked.value;
}

function onInnerClick() {
  message.info('内部按钮被点击');
}
</script>

<style scoped>
.block-ui-basic {
  width: 100%;
}
.block-ui-target {
  padding: 24px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
}
.block-ui-actions {
  margin-top: 16px;
}
</style>
