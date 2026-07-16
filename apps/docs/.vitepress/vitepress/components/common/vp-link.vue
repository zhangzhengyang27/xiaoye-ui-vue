<script setup lang="ts">
import { withBase } from 'vitepress'
import { isExternal } from '../../utils'
import { ExternalLinkIcon } from '@xiaoye-ui/icons'

defineProps<{
  href?: string
  noIcon?: boolean
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    class="link-item"
    :class="{ link: href }"
    :href="withBase(href ?? '')"
    :target="isExternal(href) ? '_blank' : undefined"
    :rel="isExternal(href) ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <ExternalLinkIcon
      v-if="isExternal(href) && !noIcon"
      class="link-icon"
      style="width: 1em; height: 1em; margin-left: 4px"
    />
  </component>
</template>

<style scoped>
.link-item {
  display: flex;
  align-items: center;
}
</style>
