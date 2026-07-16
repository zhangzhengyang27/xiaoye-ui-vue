<template>
  <a-time-picker v-model:value="value" :default-value="dayjs('00:00:00', 'HH:mm:ss')">
    <template #suffixIcon><smile-outlined /></template>
  </a-time-picker>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { SmileOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
const value = ref<Dayjs>();
</script>
