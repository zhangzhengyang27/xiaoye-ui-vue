<template>
  <a-time-picker v-model:value="value" :minute-step="15" :second-step="10" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref();
</script>
