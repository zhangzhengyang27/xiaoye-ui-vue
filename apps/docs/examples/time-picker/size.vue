<template>
  <xy-space direction="vertical">
    <xy-time-picker v-model:value="value1" size="large" />
    <xy-time-picker v-model:value="value2" />
    <xy-time-picker v-model:value="value3" size="small" />
  </xy-space>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
const value1 = ref(dayjs('12:08:23', 'HH:mm'));
const value2 = ref(dayjs('12:08:23', 'HH:mm'));
const value3 = ref(dayjs('12:08:23', 'HH:mm'));
</script>
