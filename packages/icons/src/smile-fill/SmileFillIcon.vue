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
      <path
        d="M12 2 A10 10 0 1 0 12 22 A10 10 0 1 0 12 2 Z M9 7.5 A1.5 1.5 0 1 1 9 10.5 A1.5 1.5 0 1 1 9 7.5 Z M15 7.5 A1.5 1.5 0 1 1 15 10.5 A1.5 1.5 0 1 1 15 7.5 Z M8 14 Q12 16 16 14 Q12 18 8 14 Z"
        fill="currentColor"
        fill-rule="evenodd"
        transform="scale(0.5833)"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { useBaseIcon, type BaseIconProps } from '@xiaoye-ui/core/composables';

defineOptions({ name: 'SmileFillIcon' });

const props = defineProps<BaseIconProps>();

const { pti } = useBaseIcon(props);
</script>
