<template>
  <a-timeline mode="right">
    <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
    <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
    <a-timeline-item>
      <template #dot><clock-circle-outlined style="font-size: 16px" /></template>
      Technical testing 2015-09-01
    </a-timeline-item>
    <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
  </a-timeline>
</template>
<script lang="ts" setup>
import { ClockCircleOutlined } from '@ant-design/icons-vue';
</script>
