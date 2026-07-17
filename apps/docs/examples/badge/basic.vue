<template>
  <xy-badge count="5">
    <xy-avatar shape="square" size="large" />
  </xy-badge>
  <xy-badge count="0" show-zero>
    <xy-avatar shape="square" size="large" />
  </xy-badge>
  <xy-badge>
    <template #count>
      <clock-circle-outlined style="color: #f5222d" />
    </template>
    <xy-avatar shape="square" size="large" />
  </xy-badge>
</template>

<script lang="ts" setup>
import { ClockCircleOutlined } from '@xiaoye-ui/icons';
</script>
