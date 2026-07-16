<script lang="ts" setup>
import ToggleButton from '../icons/toggle-button.vue'
</script>

<template>
  <button class="reset-btn sidebar-button flex items-center">
    <ToggleButton class="mr-2 toggle-icon" />
    <span class="leading-6">Menu</span>
  </button>
</template>

<style>
.sidebar-button {
  cursor: pointer;
  color: var(--text-color);
}

.sidebar-button .toggle-icon {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}
</style>
