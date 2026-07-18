<template>
  <div class="block-ui-document">
    <div class="toolbar">
      <xy-button type="primary" @click="blockDocument">阻塞整个文档</xy-button>
      <xy-button @click="unblockDocument">解除阻塞</xy-button>
    </div>

    <div class="placeholder">
      <p>点击「阻塞整个文档」按钮后，整个浏览器视口将被遮罩覆盖，且 body 滚动会被锁定。</p>
      <p>此模式适用于全局加载、关键操作确认等场景。</p>
    </div>

    <!-- fullScreen=true 时，遮罩挂到 document.body 上，并锁定 body 滚动 -->
    <xy-block-ui :blocked="docBlocked" full-screen tip="正在处理全局请求..." :base-z-index="2000" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const docBlocked = ref<boolean>(false);

function blockDocument() {
  docBlocked.value = true;
}

function unblockDocument() {
  docBlocked.value = false;
}
</script>

<style scoped>
.block-ui-document {
  width: 100%;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.placeholder {
  padding: 24px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
}
</style>
