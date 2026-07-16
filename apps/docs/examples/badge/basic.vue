<template>
  <a-badge count="5">
    <a-avatar shape="square" size="large" />
  </a-badge>
  <a-badge count="0" show-zero>
    <a-avatar shape="square" size="large" />
  </a-badge>
  <a-badge>
    <template #count>
      <clock-circle-outlined style="color: #f5222d" />
    </template>
    <a-avatar shape="square" size="large" />
  </a-badge>
</template>

<script lang="ts" setup>
import { ClockCircleOutlined } from '@ant-design/icons-vue';
</script>
