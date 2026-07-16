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
      <path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M13.378 15.626a1 1 0 1 1-3.243 1.282 1 1 0 0 1 3.243-1.282Z" />
      <path
        d="M2.853 11.146 13.341 21.634a1 1 0 0 0 1.414 0l3.879-3.879a1 1 0 0 0 0-1.414L8.146 5.853a1 1 0 0 0-1.414 0L2.853 9.732a1 1 0 0 0 0 1.414Z"
      />
      <path d="m5 19-2-2" />
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
