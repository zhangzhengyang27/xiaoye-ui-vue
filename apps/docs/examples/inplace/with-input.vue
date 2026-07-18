<template>
  <div class="inplace-with-input">
    <xy-inplace v-model:active="active">
      <template #display>
        <span class="display-text">{{ value || '点击输入昵称' }}</span>
      </template>
      <template #content="{ closeCallback }">
        <xy-input
          v-model:value="value"
          placeholder="请输入昵称"
          style="width: 200px"
          @pressEnter="closeCallback"
        />
        <xy-button type="primary" size="small" @click="closeCallback">确定</xy-button>
      </template>
    </xy-inplace>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const active = ref(false);
const value = ref('小明');
</script>

<style scoped>
.inplace-with-input .display-text {
  cursor: pointer;
  color: #1677ff;
}
.inplace-with-input :deep(.xy-input) {
  margin-right: 8px;
}
</style>
