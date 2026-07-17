<template>
  <xy-space direction="vertical" :size="12">
    <xy-date-picker v-model:value="time1" placeholder="Select Time" @ok="onOk">
      <span>{{ time1 ? time1.toString() : 'SelectTime' }}</span>
    </xy-date-picker>
    <xy-range-picker v-model:value="time2">
      <span>
        {{ time2 ? time2.toString() : '请选择' }}
      </span>
    </xy-range-picker>
  </xy-space>
</template>
<script lang="ts" setup>
import { Dayjs } from 'dayjs';
import { ref } from 'vue';
const time1 = ref<Dayjs>();
const time2 = ref<[Dayjs, Dayjs]>();

const onOk = (value: Dayjs) => {
  console.log('onOk: ', value);
};
</script>
