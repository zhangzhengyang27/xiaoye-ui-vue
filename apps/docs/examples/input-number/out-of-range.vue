<template>
  <a-space>
    <a-input-number v-model:value="value" :min="1" :max="10" />
    <a-button type="primary" @click="value = 99">Reset</a-button>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(99);
</script>
