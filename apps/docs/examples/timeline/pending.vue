<template>
  <div>
    <a-timeline pending="Recording..." :reverse="reverse">
      <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
      <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
      <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
    </a-timeline>
    <a-button type="primary" style="margin-top: 16px" @click="handleClick">Toggle Reverse</a-button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const reverse = ref<boolean>(false);

const handleClick = () => {
  reverse.value = !reverse.value;
};
</script>
