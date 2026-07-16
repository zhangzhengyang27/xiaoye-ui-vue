<script lang="ts" setup>
import { useRoute } from 'vitepress'
import VPLink from '../common/vp-link.vue'
import { isActive } from '../../utils'

import type { Link } from '../../types'

const props = defineProps<{
  item: Link
}>()

const route = useRoute()

const isNewPage = (item: Link) => item.activeMatch === '/some_fake_path/'
</script>

<template>
  <VPLink
    :class="{
      'is-menu-link': true,
      active: isActive(
        route.data.relativePath,
        item.activeMatch || item.link,
        !!item.activeMatch
      ),
    }"
    :href="item.link"
    :no-icon="true"
  >
    {{ item.text }}
  </VPLink>
</template>

<style scoped lang="scss">
.is-menu-link {
  display: block;
  padding: 0 12px;
  line-height: calc(var(--nav-height) - 3px);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  transition: color 0.3s;
  border-bottom: 2px solid transparent;

  &.active {
    border-bottom-color: var(--brand-color);
  }

  &:hover {
    color: var(--brand-color);
  }

  .badge {
    display: inline;
    vertical-align: unset;
  }

  .badge:deep(.is-dot) {
    right: 0;
  }
}
</style>
