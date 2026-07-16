<template>
  <a-input v-model:value="value1" show-count :maxlength="20" />
  <br />
  <br />
  <a-textarea v-model:value="value2" show-count :maxlength="100" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<string>('test value');
const value2 = ref<string>('test value');
</script>
