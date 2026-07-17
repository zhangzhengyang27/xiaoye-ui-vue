<template>
  <div>
    <xy-radio-group v-model:value="value">
      <xy-radio :value="1">A</xy-radio>
      <xy-radio :value="2">B</xy-radio>
      <xy-radio :value="3">C</xy-radio>
      <xy-radio :value="4">D</xy-radio>
    </xy-radio-group>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(1);
</script>
