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
        <path d="M3 5h18" />
        <path d="M3 12h18" />
        <path d="M3 19h18" />
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
