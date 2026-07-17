<script setup lang="ts">
import { withBase, useData } from 'vitepress';
import VPNavbarSearch from './navbar/vp-search.vue';
import VPNavbarMenu from './navbar/vp-menu.vue';
import VPNavbarThemeToggler from './navbar/vp-theme-toggler.vue';
import VPNavbarHamburger from './navbar/vp-hamburger.vue';
import xiaoyeUiPkg from 'xiaoye-ui/package.json';

defineProps<{
  fullScreen: boolean;
}>();

defineEmits(['toggle']);

const { theme } = useData();
const version = xiaoyeUiPkg.version;
</script>

<template>
  <div class="navbar-wrapper">
    <div class="header-container">
      <div class="logo-container">
        <a :href="withBase('/')" class="logo-text">XiaoyeUI</a>
        <xy-tag round size="small" title="latest version">{{ version }}</xy-tag>
      </div>
      <div class="content">
        <VPNavbarSearch class="search" :options="theme.agolia" multilang />
        <VPNavbarMenu class="menu" />
        <VPNavbarThemeToggler class="theme-toggler" />
        <VPNavbarHamburger :active="fullScreen" class="hamburger" @click="$emit('toggle')" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--header-height);

  .logo-text {
    font-size: 18px;
    font-weight: 700;
    color: var(--el-color-primary);
    text-decoration: none;
    letter-spacing: 0.5px;
  }
}
</style>
