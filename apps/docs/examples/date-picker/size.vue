<template>
  <xy-space direction="vertical" :size="12">
    <xy-radio-group v-model:value="size">
      <xy-radio-button value="large">Large</xy-radio-button>
      <xy-radio-button value="default">Default</xy-radio-button>
      <xy-radio-button value="small">Small</xy-radio-button>
    </xy-radio-group>
    <xy-date-picker :size="size" />
    <xy-date-picker :size="size" placeholder="Select Month" picker="month" />
    <xy-range-picker :size="size" />
    <xy-date-picker :size="size" placeholder="Select Week" picker="week" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const size = ref<any>('default');
</script>
