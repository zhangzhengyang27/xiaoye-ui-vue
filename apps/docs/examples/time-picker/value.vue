<template>
  <xy-space direction="vertical">
    <p>use value and @change</p>
    <xy-time-picker :value="value" @change="onChange" />
    <p>v-model</p>
    <xy-time-picker v-model:value="value" />
    <p>Do not change</p>
    <xy-time-picker :value="value2" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

const value = ref<Dayjs>();

const onChange = (time: Dayjs) => {
  console.log(time);
  value.value = time;
};

const value2 = ref(dayjs());
</script>
