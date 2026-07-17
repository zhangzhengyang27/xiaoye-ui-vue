<template>
  <xy-radio-group v-model:value="value">
    <xy-radio :style="radioStyle" :value="1">Option A</xy-radio>
    <xy-radio :style="radioStyle" :value="2">Option B</xy-radio>
    <xy-radio :style="radioStyle" :value="3">Option C</xy-radio>
    <xy-radio :style="radioStyle" :value="4">
      More...
      <xy-input v-if="value === 4" style="width: 100px; margin-left: 10px" />
    </xy-radio>
  </xy-radio-group>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
const value = ref<number>(1);
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});
</script>
