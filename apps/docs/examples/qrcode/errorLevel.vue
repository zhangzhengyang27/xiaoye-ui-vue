<template>
  <a-qrcode
    :error-level="level"
    value="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
  />
  <br />
  <br />
  <a-segmented v-model:value="level" :options="segmentedData" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const segmentedData = ['L', 'M', 'Q', 'H'];
const level = ref(segmentedData[0]);
</script>
