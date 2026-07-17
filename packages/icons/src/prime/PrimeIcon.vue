<template>
  <span class="xyicon">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      v-bind="$attrs"
    >
      <path d="M4 22V4l8 7 8-7v18h-3V9.5l-5 4.5-5-4.5V22H4z" />
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
