<template>
  <a-space direction="vertical" style="width: 100%">
    <a-input-number status="error" style="width: 100%" />
    <a-input-number status="warning" style="width: 100%" />
    <a-input-number status="error" style="width: 100%">
      <template #prefix><ClockCircleOutlined /></template>
    </a-input-number>
    <a-input-number status="warning" style="width: 100%">
      <template #prefix><ClockCircleOutlined /></template>
    </a-input-number>
  </a-space>
</template>

<script lang="ts" setup>
import { ClockCircleOutlined } from '@ant-design/icons-vue';
</script>
