<template>
  <xy-timeline>
    <xy-timeline-item color="green">Create a services site 2015-09-01</xy-timeline-item>
    <xy-timeline-item color="green">Create a services site 2015-09-01</xy-timeline-item>
    <xy-timeline-item color="red">
      <p>Solve initial network problems 1</p>
      <p>Solve initial network problems 2</p>
      <p>Solve initial network problems 3 2015-09-01</p>
    </xy-timeline-item>
    <xy-timeline-item>
      <p>Technical testing 1</p>
      <p>Technical testing 2</p>
      <p>Technical testing 3 2015-09-01</p>
    </xy-timeline-item>
    <xy-timeline-item color="gray">
      <p>Technical testing 1</p>
      <p>Technical testing 2</p>
      <p>Technical testing 3 2015-09-01</p>
    </xy-timeline-item>
    <xy-timeline-item color="gray">
      <p>Technical testing 1</p>
      <p>Technical testing 2</p>
      <p>Technical testing 3 2015-09-01</p>
    </xy-timeline-item>
    <xy-timeline-item color="#00CCFF">
      <template #dot>
        <SmileOutlined />
      </template>
      <p>Custom color testing</p>
    </xy-timeline-item>
  </xy-timeline>
</template>
<script lang="ts" setup>
import { SmileOutlined } from '@xiaoye-ui/icons';
</script>
