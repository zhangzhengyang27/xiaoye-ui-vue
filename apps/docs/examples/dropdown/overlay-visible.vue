<template>
  <xy-dropdown v-model:open="visible">
    <a class="xy-dropdown-link" @click.prevent>
      Hover me
      <DownOutlined />
    </a>
    <template #overlay>
      <xy-menu @click="handleMenuClick">
        <xy-menu-item key="1">Clicking me will not close the menu.</xy-menu-item>
        <xy-menu-item key="2">Clicking me will not close the menu also.</xy-menu-item>
        <xy-menu-item key="3">Clicking me will close the menu</xy-menu-item>
      </xy-menu>
    </template>
  </xy-dropdown>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { DownOutlined } from '@xiaoye-ui/icons';
import type { MenuProps } from 'xiaoye-ui';
const visible = ref(false);
const handleMenuClick: MenuProps['onClick'] = e => {
  if (e.key === '3') {
    visible.value = false;
  }
};
</script>
