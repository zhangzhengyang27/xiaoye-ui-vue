<template>
  <a-space direction="vertical" :size="12">
    <a-date-picker show-time placeholder="Select Time" @change="onChange" @ok="onOk" />
    <a-range-picker
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :placeholder="['Start Time', 'End Time']"
      @change="onRangeChange"
      @ok="onRangeOk"
    />
  </a-space>
</template>
<script lang="ts" setup>
import { Dayjs } from 'dayjs';

const onChange = (value: Dayjs, dateString: string) => {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
};

const onOk = (value: Dayjs) => {
  console.log('onOk: ', value);
};

const onRangeChange = (value: [Dayjs, Dayjs], dateString: [string, string]) => {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
};

const onRangeOk = (value: [Dayjs, Dayjs]) => {
  console.log('onOk: ', value);
};
</script>
