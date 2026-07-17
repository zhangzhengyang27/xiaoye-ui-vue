<template>
  <xy-dropdown>
    <a class="xy-dropdown-link" @click.prevent>
      Cascading menu
      <DownOutlined />
    </a>
    <template #overlay>
      <xy-menu>
        <xy-menu-item>1st menu item</xy-menu-item>
        <xy-menu-item>2nd menu item</xy-menu-item>
        <xy-sub-menu key="sub1" title="sub menu">
          <xy-menu-item>3rd menu item</xy-menu-item>
          <xy-menu-item>4th menu item</xy-menu-item>
        </xy-sub-menu>
        <xy-sub-menu key="sub2" title="disabled sub menu" disabled>
          <xy-menu-item>5d menu item</xy-menu-item>
          <xy-menu-item>6th menu item</xy-menu-item>
        </xy-sub-menu>
      </xy-menu>
    </template>
  </xy-dropdown>
</template>
<script lang="ts" setup>
import { DownOutlined } from '@xiaoye-ui/icons';
</script>
