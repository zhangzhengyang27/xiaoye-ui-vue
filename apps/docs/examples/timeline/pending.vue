<template>
  <div>
    <xy-timeline pending="Recording..." :reverse="reverse">
      <xy-timeline-item>Create a services site 2015-09-01</xy-timeline-item>
      <xy-timeline-item>Solve initial network problems 2015-09-01</xy-timeline-item>
      <xy-timeline-item>Technical testing 2015-09-01</xy-timeline-item>
    </xy-timeline>
    <xy-button type="primary" style="margin-top: 16px" @click="handleClick">
      Toggle Reverse
    </xy-button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const reverse = ref<boolean>(false);

const handleClick = () => {
  reverse.value = !reverse.value;
};
</script>
