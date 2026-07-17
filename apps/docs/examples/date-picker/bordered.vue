<template>
  <xy-space direction="vertical" :size="12">
    <xy-date-picker v-model:value="value1" :bordered="false" />
    <xy-date-picker v-model:value="value2" picker="week" :bordered="false" />
    <xy-date-picker v-model:value="value3" picker="month" :bordered="false" />
    <xy-date-picker v-model:value="value4" picker="quarter" :bordered="false" />
    <xy-date-picker v-model:value="value5" picker="year" :bordered="false" />

    <xy-range-picker v-model:value="value6" :bordered="false" />
    <xy-range-picker v-model:value="value7" picker="week" :bordered="false" />
    <xy-range-picker v-model:value="value8" picker="month" :bordered="false" />
    <xy-range-picker v-model:value="value9" picker="year" :bordered="false" />
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
const value6 = ref<[Dayjs, Dayjs]>();
const value7 = ref<[Dayjs, Dayjs]>();
const value8 = ref<[Dayjs, Dayjs]>();
const value9 = ref<[Dayjs, Dayjs]>();
</script>
