<template>
  <a-dropdown>
    <a class="xy-dropdown-link" @click.prevent>
      Hover me, Click menu item
      <DownOutlined />
    </a>
    <template #overlay>
      <a-menu @click="onClick">
        <a-menu-item key="1">1st menu item</a-menu-item>
        <a-menu-item key="2">2nd menu item</a-menu-item>
        <a-menu-item key="3">3rd menu item</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script lang="ts" setup>
import { DownOutlined } from '@xiaoye-ui/icons';
import type { MenuProps } from 'xiaoye-ui';

const onClick: MenuProps['onClick'] = ({ key }) => {
  console.log(`Click on item ${key}`);
};
</script>
