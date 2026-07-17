<template>
  <xy-dropdown>
    <a class="xy-dropdown-link" @click.prevent>
      Hover me, Click menu item
      <DownOutlined />
    </a>
    <template #overlay>
      <xy-menu @click="onClick">
        <xy-menu-item key="1">1st menu item</xy-menu-item>
        <xy-menu-item key="2">2nd menu item</xy-menu-item>
        <xy-menu-item key="3">3rd menu item</xy-menu-item>
      </xy-menu>
    </template>
  </xy-dropdown>
</template>
<script lang="ts" setup>
import { DownOutlined } from '@xiaoye-ui/icons';
import type { MenuProps } from 'xiaoye-ui';

const onClick: MenuProps['onClick'] = ({ key }) => {
  console.log(`Click on item ${key}`);
};
</script>
