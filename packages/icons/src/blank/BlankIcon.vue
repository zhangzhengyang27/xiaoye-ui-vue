<template>
  <span class="xyicon">
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      v-bind="pti()"
    >
      <rect width="1" height="1" fill="currentColor" fill-opacity="0" />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { useBaseIcon, type BaseIconProps } from '@xiaoye-ui/core/composables';

defineOptions({ name: 'BlankIcon' });

const props = defineProps<BaseIconProps>();

const { pti } = useBaseIcon(props);
</script>
