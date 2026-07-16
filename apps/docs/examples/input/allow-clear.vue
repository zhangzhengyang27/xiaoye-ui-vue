<template>
  <div>
    <a-input v-model:value="value1" placeholder="input with clear icon" allow-clear />
    <br />
    <br />
    <a-textarea v-model:value="value2" placeholder="textarea with clear icon" allow-clear />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<string>('');
const value2 = ref<string>('');
</script>
