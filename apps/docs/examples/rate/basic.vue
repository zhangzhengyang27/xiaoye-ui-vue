<template>
  <a-rate v-model:value="value" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(2);
</script>
