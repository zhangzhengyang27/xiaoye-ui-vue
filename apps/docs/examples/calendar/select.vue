<template>
  <xy-alert
    :message="`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`"
  />
  <xy-calendar :value="date" @select="onSelect" @panelChange="onPanelChange" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
const date = ref(dayjs('2017-01-25'));
const selectedValue = ref(dayjs('2017-01-25'));

const onSelect = (value: Dayjs) => {
  date.value = value;
  selectedValue.value = value;
};
const onPanelChange = (value: Dayjs) => {
  date.value = value;
};
</script>
