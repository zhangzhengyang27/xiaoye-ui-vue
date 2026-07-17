<template>
  <xy-space direction="vertical">
    <xy-time-picker v-model:value="value" use12-hours />
    <xy-time-picker v-model:value="value" use12-hours format="h:mm:ss A" style="width: 140px" />
    <xy-time-picker v-model:value="value" use12-hours format="h:mm a" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Dayjs } from 'dayjs';
const value = ref<Dayjs>();
</script>
