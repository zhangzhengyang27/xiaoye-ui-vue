<template>
    <span class="xyicon">
    <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="14" y="3" width="5" height="18" rx="1" />
      <rect x="5" y="3" width="5" height="18" rx="1" />
    </g>
  </svg>
  </span>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: [Number, String],
    default: 14,
  },
});
</script>
