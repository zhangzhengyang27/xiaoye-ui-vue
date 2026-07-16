<template>
  <a-radio-group v-model:value="value" name="radioGroup">
    <a-radio value="1">A</a-radio>
    <a-radio value="2">B</a-radio>
    <a-radio value="3">C</a-radio>
    <a-radio value="4">D</a-radio>
  </a-radio-group>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('1');
</script>
