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
      <path d="M19 20.5A9.5 9.5 0 0 0 12 11a9.5 9.5 0 0 0-7 9.5" />
      <path d="M5 20.5A9.5 9.5 0 0 1 12 11a9.5 9.5 0 0 1 7 9.5" />
      <path d="M19 20.5a9.5 9.5 0 0 0-7-9.5 9.5 9.5 0 0 0-7 9.5" />
      <path d="M12 11v9.5" />
      <path d="M9 7.5 7 4.5" />
      <path d="m15 7.5 2-3" />
      <circle cx="9.5" cy="7" r="0.5" />
      <circle cx="14.5" cy="7" r="0.5" />
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
