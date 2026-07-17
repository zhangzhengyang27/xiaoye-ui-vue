<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-input-number status="error" style="width: 100%" />
    <xy-input-number status="warning" style="width: 100%" />
    <xy-input-number status="error" style="width: 100%">
      <template #prefix><ClockCircleOutlined /></template>
    </xy-input-number>
    <xy-input-number status="warning" style="width: 100%">
      <template #prefix><ClockCircleOutlined /></template>
    </xy-input-number>
  </xy-space>
</template>

<script lang="ts" setup>
import { ClockCircleOutlined } from '@xiaoye-ui/icons';
</script>
