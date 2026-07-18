<template>
  <div class="inline-edit-disabled">
    <p class="label">只读字段</p>
    <xy-inline-edit v-model="value" disabled placeholder="禁用状态" />
    <p class="tip">设置 disabled 后，展示区不再响应点击与键盘事件，无法进入编辑模式。</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 禁用状态：无法进入编辑模式
const value = ref('只读内容，不可编辑');
</script>

<style scoped>
.inline-edit-disabled .label {
  margin-bottom: 8px;
  color: #666;
}
.inline-edit-disabled .tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}
</style>
