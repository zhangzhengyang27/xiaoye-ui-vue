<template>
  <a-space direction="vertical" :size="12">
    <a-radio-group v-model:value="size">
      <a-radio-button value="large">Large</a-radio-button>
      <a-radio-button value="default">Default</a-radio-button>
      <a-radio-button value="small">Small</a-radio-button>
    </a-radio-group>
    <a-date-picker :size="size" />
    <a-date-picker :size="size" placeholder="Select Month" picker="month" />
    <a-range-picker :size="size" />
    <a-date-picker :size="size" placeholder="Select Week" picker="week" />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const size = ref<any>('default');
</script>
