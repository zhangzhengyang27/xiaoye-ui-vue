<template>
  <xy-space direction="vertical" :size="12">
    <xy-date-picker
      :mode="mode1"
      show-time
      @openChange="handleOpenChange1"
      @panelChange="handlePanelChange1"
    />
    <xy-range-picker
      :placeholder="['Start month', 'End month']"
      format="YYYY-MM"
      :value="value"
      :mode="mode2"
      @panelChange="handlePanelChange2"
      @change="handleChange"
    />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Dayjs } from 'dayjs';
const mode1 = ref<any>('time');
const mode2 = ref<any>(['month', 'month']);
const value = ref<[Dayjs, Dayjs]>();

const handleOpenChange1 = (open: boolean) => {
  if (open) {
    mode1.value = 'time';
  }
};

const handleChange = (val: [Dayjs, Dayjs]) => {
  value.value = val;
};

const handlePanelChange1 = (_val: [Dayjs, Dayjs], mode: any) => {
  mode1.value = mode;
};

const handlePanelChange2 = (val: [Dayjs, Dayjs], mode: any[]) => {
  value.value = val;
  mode2.value = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
};
</script>
