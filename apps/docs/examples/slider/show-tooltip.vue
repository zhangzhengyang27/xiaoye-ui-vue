<template>
  <a-slider v-model:value="value" :tooltip-open="true" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(30);
</script>
