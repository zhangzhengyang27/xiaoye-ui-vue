<template>
  <a-space direction="vertical">
    <p>use value and @change</p>
    <a-time-picker :value="value" @change="onChange" />
    <p>v-model</p>
    <a-time-picker v-model:value="value" />
    <p>Do not change</p>
    <a-time-picker :value="value2" />
  </a-space>
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
