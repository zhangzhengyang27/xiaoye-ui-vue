<template>
  <xy-space direction="vertical" :size="12">
    <xy-select v-model:value="type">
      <xy-select-option value="time">Time</xy-select-option>
      <xy-select-option value="date">Date</xy-select-option>
      <xy-select-option value="week">Week</xy-select-option>
      <xy-select-option value="month">Month</xy-select-option>
      <xy-select-option value="quarter">Quarter</xy-select-option>
      <xy-select-option value="year">Year</xy-select-option>
    </xy-select>
    <template v-if="type === 'time'">
      <xy-time-picker />
    </template>
    <template v-else>
      <xy-date-picker :picker="type" />
    </template>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const type = ref<any>('time');
</script>
