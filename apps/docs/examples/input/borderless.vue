<template>
  <a-input v-model:value="value" :bordered="false" placeholder="Borderless" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('');
</script>
