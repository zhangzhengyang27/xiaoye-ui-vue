<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<template>
  <button
    :class="{ active }"
    aria-label="菜单"
    :aria-expanded="active"
    aria-controls="full-screen"
    class="reset-btn menu-hamburger"
  >
    <span class="hamburger-1" />
    <span class="hamburger-2" />
    <span class="hamburger-3" />
  </button>
</template>
