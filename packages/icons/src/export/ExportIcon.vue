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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.4 1.2H2.6C1.916 1.2 1.4 1.716 1.4 2.4V11.6C1.4 12.284 1.916 12.8 2.6 12.8H11.4C12.084 12.8 12.6 12.284 12.6 11.6V8.6C12.6 8.268 12.868 8 13.2 8C13.532 8 13.8 8.268 13.8 8.6V11.6C13.8 12.948 12.748 14 11.4 14H2.6C1.252 14 0.2 12.948 0.2 11.6V2.4C0.2 1.052 1.252 0 2.6 0H8.4C8.732 0 9 0.268 9 0.6C9 0.932 8.732 1.2 8.4 1.2Z M13.036 7.414C13.231 7.219 13.231 6.901 13.036 6.706L10.43 4.1C10.235 3.905 9.917 3.905 9.722 4.1C9.527 4.295 9.527 4.613 9.722 4.808L11.414 6.5H6.4C6.134 6.5 5.9 6.734 5.9 7C5.9 7.266 6.134 7.5 6.4 7.5H11.414L9.722 9.192C9.527 9.387 9.527 9.705 9.722 9.9C9.917 10.095 10.235 10.095 10.43 9.9L13.036 7.414Z"
        fill="currentColor"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { useBaseIcon, type BaseIconProps } from '@xiaoye-ui/core/composables';

defineOptions({ name: 'ExportIcon' });

const props = defineProps<BaseIconProps>();

const { pti } = useBaseIcon(props);
</script>
