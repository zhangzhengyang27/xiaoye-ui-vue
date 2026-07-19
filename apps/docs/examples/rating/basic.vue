<template>
  <xy-space direction="vertical">
    <div>
      <span class="demo-label">默认：</span>
      <xy-rating v-model:value="value" />
      <span class="demo-value">{{ value }} 星</span>
    </div>
    <div>
      <span class="demo-label">指定总数：</span>
      <xy-rating v-model:value="value1" :count="10" />
      <span class="demo-value">{{ value1 }} 星</span>
    </div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 基础评分：支持 v-model:value 与 count 自定义星星数量。
const value = ref(3);
const value1 = ref(7);
</script>
<style scoped>
.demo-label {
  display: inline-block;
  width: 80px;
  color: rgba(0, 0, 0, 0.65);
}
.demo-value {
  margin-left: 12px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
