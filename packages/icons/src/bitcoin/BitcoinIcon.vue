<template>
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
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 7.5h3a2.5 2.5 0 0 1 0 5h-3z" />
      <path d="M9.5 12.5H13a2.5 2.5 0 0 1 0 5H9.5z" />
      <path d="M8 7.5v10" />
      <path d="M11.5 5v2.5" />
      <path d="M11.5 17.5V20" />
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: [Number, String],
    default: 14,
  },
});
</script>
