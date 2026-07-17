<template>
  <xy-space>
    <xy-button type="primary">Primary</xy-button>
    <xy-button>secondary</xy-button>
    <xy-dropdown>
      <template #overlay>
        <xy-menu @click="handleMenuClick">
          <xy-menu-item key="1">1st item</xy-menu-item>
          <xy-menu-item key="2">2nd item</xy-menu-item>
          <xy-menu-item key="3">3rd item</xy-menu-item>
        </xy-menu>
      </template>
      <xy-button>
        Actions
        <DownOutlined />
      </xy-button>
    </xy-dropdown>
  </xy-space>
</template>

<script lang="ts" setup>
import { DownOutlined } from '@xiaoye-ui/icons';
import type { MenuProps } from 'xiaoye-ui';
const handleMenuClick: MenuProps['onClick'] = e => {
  console.log('click', e);
};
</script>
