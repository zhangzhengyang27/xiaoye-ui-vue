<template>
  <xy-timeline mode="right">
    <xy-timeline-item>Create a services site 2015-09-01</xy-timeline-item>
    <xy-timeline-item>Solve initial network problems 2015-09-01</xy-timeline-item>
    <xy-timeline-item>
      <template #dot><clock-circle-outlined style="font-size: 16px" /></template>
      Technical testing 2015-09-01
    </xy-timeline-item>
    <xy-timeline-item>Network problems being solved 2015-09-01</xy-timeline-item>
  </xy-timeline>
</template>
<script lang="ts" setup>
import { ClockCircleOutlined } from '@xiaoye-ui/icons';
</script>
