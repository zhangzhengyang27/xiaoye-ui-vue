<template>
  <xy-space direction="vertical">
    <xy-date-picker v-model:value="value1" />
    <xy-date-picker v-model:value="value2" disabled picker="month" />
    <xy-range-picker v-model:value="value3" disabled />
    <xy-range-picker v-model:value="value4" :disabled="[false, true]" />
  </xy-space>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';
const dateFormat = 'YYYY-MM-DD';
const value1 = ref<Dayjs>(dayjs('2015-06-06', dateFormat));
const value2 = ref<Dayjs>(dayjs('2015-06', 'YYYY-MM'));
const value3 = ref<[Dayjs, Dayjs]>([
  dayjs('2015-06-06', dateFormat),
  dayjs('2015-06-06', dateFormat),
]);
const value4 = ref<[Dayjs, Dayjs]>([
  dayjs('2019-09-03', dateFormat),
  dayjs('2019-11-22', dateFormat),
]);
</script>
