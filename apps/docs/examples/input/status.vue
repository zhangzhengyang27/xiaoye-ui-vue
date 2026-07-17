<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-input status="error" placeholder="Error" />
    <xy-input status="warning" placeholder="Warning" />
    <xy-input status="error" placeholder="Error with prefix">
      <template #prefix><ClockCircleOutlined /></template>
    </xy-input>
    <xy-input status="warning" placeholder="Warning with prefix">
      <template #prefix><ClockCircleOutlined /></template>
    </xy-input>
  </xy-space>
</template>

<script lang="ts" setup>
import { ClockCircleOutlined } from '@xiaoye-ui/icons';
</script>
