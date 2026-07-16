<template>
  <a-space direction="vertical" style="width: 100%">
    <a-input status="error" placeholder="Error" />
    <a-input status="warning" placeholder="Warning" />
    <a-input status="error" placeholder="Error with prefix">
      <template #prefix><ClockCircleOutlined /></template>
    </a-input>
    <a-input status="warning" placeholder="Warning with prefix">
      <template #prefix><ClockCircleOutlined /></template>
    </a-input>
  </a-space>
</template>

<script lang="ts" setup>
import { ClockCircleOutlined } from '@ant-design/icons-vue';
</script>
