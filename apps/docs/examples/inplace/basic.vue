<template>
  <div class="inplace-basic">
    <xy-inplace v-model:active="active">
      <template #display>
        <span class="display-text">{{ text }}</span>
      </template>
      <template #content="{ closeCallback }">
        <span class="content-text">编辑中…</span>
        <xy-button type="primary" size="small" @click="closeCallback">完成</xy-button>
      </template>
    </xy-inplace>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// active 与父组件通过 v-model:active 双向绑定
const active = ref(false);
const text = ref('点击我进入编辑模式');
</script>

<style scoped>
.inplace-basic .display-text {
  cursor: pointer;
  color: #1677ff;
}
.inplace-basic .content-text {
  margin-right: 8px;
}
</style>
