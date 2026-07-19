<template>
  <div class="demo-image-compare">
    <xy-image-compare v-model:value="value" />
    <div class="demo-value">当前位置：{{ value }}%</div>
    <xy-slider v-model:value="value" :min="0" :max="100" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 受控用法：通过 v-model:value 与外部状态同步。
const value = ref(30);
</script>
<style scoped>
.demo-image-compare {
  max-width: 600px;
  margin: 0 auto;
}
.demo-value {
  margin: 16px 0 8px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
