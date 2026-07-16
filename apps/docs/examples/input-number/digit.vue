<template>
  <a-input-number
    v-model:value="value"
    style="width: 200px"
    :min="0"
    :max="10"
    :step="0.00000000000001"
    string-mode
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('1');
</script>
