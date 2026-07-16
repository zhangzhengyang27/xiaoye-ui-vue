<template>
  <a-space direction="vertical">
    <a-time-picker v-model:value="value" use12-hours />
    <a-time-picker v-model:value="value" use12-hours format="h:mm:ss A" style="width: 140px" />
    <a-time-picker v-model:value="value" use12-hours format="h:mm a" />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Dayjs } from 'dayjs';
const value = ref<Dayjs>();
</script>
