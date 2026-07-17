<template>
  <xy-space direction="vertical">
    <xy-switch v-model:checked="state.checked1" loading />
    <xy-switch v-model:checked="state.checked2" size="small" loading />
  </xy-space>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
const state = reactive({
  checked1: true,
  checked2: false,
});
</script>
