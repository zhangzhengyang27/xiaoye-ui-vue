<template>
  <xy-timeline mode="alternate">
    <xy-timeline-item>Create a services site 2015-09-01</xy-timeline-item>
    <xy-timeline-item color="green">Solve initial network problems 2015-09-01</xy-timeline-item>
    <xy-timeline-item>
      <template #dot><ClockCircleOutlined style="font-size: 16px" /></template>
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
      laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
      beatae vitae dicta sunt explicabo.
    </xy-timeline-item>
    <xy-timeline-item color="red">Network problems being solved 2015-09-01</xy-timeline-item>
    <xy-timeline-item>Create a services site 2015-09-01</xy-timeline-item>
    <xy-timeline-item>
      <template #dot><ClockCircleOutlined style="font-size: 16px" /></template>
      Technical testing 2015-09-01
    </xy-timeline-item>
  </xy-timeline>
</template>
<script lang="ts" setup>
import { ClockCircleOutlined } from '@xiaoye-ui/icons';
</script>
