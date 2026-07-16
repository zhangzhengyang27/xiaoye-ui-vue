<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { useSidebar } from '../composables/sidebar'
import { useFullScreen } from '../composables/fullscreen'
import { useToggleWidgets } from '../composables/toggle-widgets'
import { breakpoints } from '../constant'
import VpNavbar from './vp-navbar.vue'

const { hasSidebar } = useSidebar()
const { toggleFullScreen, isFullScreen } = useFullScreen()
const close = () => toggleFullScreen(false)

useToggleWidgets(isFullScreen, () => {
  if (!isClient) return
  if (window.outerWidth >= breakpoints.md) {
    close()
  }
})
</script>

<template>
  <header :class="{ navbar: true, 'has-sidebar': hasSidebar }">
    <VpNavbar :full-screen="isFullScreen" @toggle="toggleFullScreen" />
  </header>
</template>
