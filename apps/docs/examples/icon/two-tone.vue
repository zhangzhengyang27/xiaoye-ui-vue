<template>
  <a-space>
    <smile-two-tone />
    <heart-two-tone two-tone-color="#eb2f96" />
    <check-circle-two-tone two-tone-color="#52c41a" />
  </a-space>
</template>
<script lang="ts" setup>
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone } from '@ant-design/icons-vue';
</script>
<style scoped>
.icons-list :deep(.anticon) {
  margin-right: 6px;
  font-size: 24px;
}
</style>
