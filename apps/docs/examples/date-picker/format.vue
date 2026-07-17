<template>
  <xy-space direction="vertical" :size="12">
    <xy-date-picker v-model:value="value1" :format="dateFormat" />
    <xy-date-picker v-model:value="value2" :format="dateFormatList" />
    <xy-date-picker v-model:value="value3" :format="monthFormat" picker="month" />
    <xy-range-picker v-model:value="value4" :format="dateFormat" />
    <xy-date-picker v-model:value="value5" :format="customFormat" />
    <xy-date-picker v-model:value="value6" :format="customWeekStartEndFormat" picker="week" />
  </xy-space>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

const customWeekStartEndFormat = value =>
  `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    .endOf('week')
    .format(weekFormat)}`;
const value1 = ref<Dayjs>(dayjs('2015/01/01', dateFormat));
const value2 = ref<Dayjs>(dayjs('01/01/2015', dateFormatList[0]));
const value3 = ref<Dayjs>(dayjs('2015/01', monthFormat));
const value4 = ref<[Dayjs, Dayjs]>([
  dayjs('2015/01/01', dateFormat),
  dayjs('2015/01/01', dateFormat),
]);
const value5 = ref<Dayjs>(dayjs('2015/01/01', dateFormat));
const value6 = ref<Dayjs>(dayjs());
const customFormat = value => `custom format: ${value.format(dateFormat)}`;
</script>
