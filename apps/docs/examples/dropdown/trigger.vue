<template>
  <xy-dropdown :trigger="['click']">
    <a class="xy-dropdown-link" @click.prevent>
      Click me
      <DownOutlined />
    </a>
    <template #overlay>
      <xy-menu>
        <xy-menu-item key="0">
          <a href="http://www.alipay.com/">1st menu item</a>
        </xy-menu-item>
        <xy-menu-item key="1">
          <a href="http://www.taobao.com/">2nd menu item</a>
        </xy-menu-item>
        <xy-menu-divider />
        <xy-menu-item key="3">3rd menu item</xy-menu-item>
      </xy-menu>
    </template>
  </xy-dropdown>
</template>
<script lang="ts" setup>
import { DownOutlined } from '@xiaoye-ui/icons';
</script>
