<template>
  <xy-time-picker v-model:value="value" :default-value="dayjs('00:00:00', 'HH:mm:ss')">
    <template #suffixIcon><smile-outlined /></template>
  </xy-time-picker>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { SmileOutlined } from '@xiaoye-ui/icons';
import { ref } from 'vue';
const value = ref<Dayjs>();
</script>
