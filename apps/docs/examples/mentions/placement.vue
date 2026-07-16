<template>
  <a-mentions v-model:value="value" placement="top" :options="options"></a-mentions>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('');
const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];
</script>
