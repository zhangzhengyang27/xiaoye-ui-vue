<template>
  <xy-space direction="vertical">
    <xy-input v-model:value="value" placeholder="Basic usage" />
    <xy-input v-model:value.lazy="value1" autofocus placeholder="Lazy usage" />
  </xy-space>
</template>
<script lang="ts" setup>
import { watch, ref } from 'vue';
const value = ref<string>('');
const value1 = ref<string>('');
watch(value, () => {
  console.log(value.value);
});
watch(value1, () => {
  console.log(value1.value);
});
</script>
