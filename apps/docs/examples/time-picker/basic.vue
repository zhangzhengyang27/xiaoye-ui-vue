<template>
  <a-space direction="vertical">
    <a-time-picker v-model:value="value" />
    <a-time-picker v-model:value="strValue" value-format="HH:mm:ss" />
  </a-space>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref, watch } from 'vue';
const value = ref<Dayjs>(dayjs('08:00:00', 'HH:mm:ss'));
const strValue = ref<string>('09:00:00');

watch(value, () => {
  console.log(value.value);
});
watch(strValue, () => {
  console.log(strValue.value);
});
</script>
