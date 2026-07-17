<template>
  <xy-space direction="vertical" :size="12">
    <xy-date-picker v-model:value="value1" />
    <xy-date-picker v-model:value="value2" picker="week" />
    <xy-date-picker v-model:value="value3" picker="month" />
    <xy-date-picker v-model:value="value4" picker="quarter" />
    <xy-date-picker v-model:value="value5" picker="year" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
const value1 = ref<Dayjs>();
const value2 = ref<Dayjs>();
const value3 = ref<Dayjs>();
const value4 = ref<Dayjs>();
const value5 = ref<Dayjs>();
</script>
