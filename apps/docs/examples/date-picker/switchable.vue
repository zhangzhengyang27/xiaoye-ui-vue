<template>
  <a-space direction="vertical" :size="12">
    <a-select v-model:value="type">
      <a-select-option value="time">Time</a-select-option>
      <a-select-option value="date">Date</a-select-option>
      <a-select-option value="week">Week</a-select-option>
      <a-select-option value="month">Month</a-select-option>
      <a-select-option value="quarter">Quarter</a-select-option>
      <a-select-option value="year">Year</a-select-option>
    </a-select>
    <template v-if="type === 'time'">
      <a-time-picker />
    </template>
    <template v-else>
      <a-date-picker :picker="type" />
    </template>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const type = ref<any>('time');
</script>
