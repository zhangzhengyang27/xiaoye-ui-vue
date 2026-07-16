<template>
  <a-space direction="vertical">
    <a-time-picker v-model:value="value1" size="large" />
    <a-time-picker v-model:value="value2" />
    <a-time-picker v-model:value="value3" size="small" />
  </a-space>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
const value1 = ref(dayjs('12:08:23', 'HH:mm'));
const value2 = ref(dayjs('12:08:23', 'HH:mm'));
const value3 = ref(dayjs('12:08:23', 'HH:mm'));
</script>
