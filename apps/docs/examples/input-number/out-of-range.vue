<template>
  <xy-space>
    <xy-input-number v-model:value="value" :min="1" :max="10" />
    <xy-button type="primary" @click="value = 99">Reset</xy-button>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(99);
</script>
