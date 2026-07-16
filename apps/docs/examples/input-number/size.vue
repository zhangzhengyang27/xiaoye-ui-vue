<template>
  <a-space>
    <a-input-number v-model:value="value1" size="large" :min="1" :max="100000" />
    <a-input-number v-model:value="value2" :min="1" :max="100000" />
    <a-input-number v-model:value="value3" size="small" :min="1" :max="100000" />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<number>(3);
const value2 = ref<number>(3);
const value3 = ref<number>(3);
</script>
