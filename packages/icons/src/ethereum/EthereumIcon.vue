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
    <path
      d="M12 1.75 5.75 12.25 12 16l6.25-3.75L12 1.75zm0 0v14.25L5.75 12.25 12 1.75zm0 15.5L5.75 13 12 22.25 18.25 13 12 17.25z"
    />
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
