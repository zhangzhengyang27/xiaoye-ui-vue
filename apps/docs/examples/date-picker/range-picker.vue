<template>
  <xy-space direction="vertical" :size="12">
    <xy-range-picker v-model:value="value1" />
    <xy-range-picker v-model:value="value2" show-time />
    <xy-range-picker v-model:value="value3" picker="week" />
    <xy-range-picker v-model:value="value4" picker="month" />
    <xy-range-picker v-model:value="value5" picker="year" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
type RangeValue = [Dayjs, Dayjs];
const value1 = ref<RangeValue>();
const value2 = ref<RangeValue>();
const value3 = ref<RangeValue>();
const value4 = ref<RangeValue>();
const value5 = ref<RangeValue>();
</script>
