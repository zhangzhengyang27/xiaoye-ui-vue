<template>
  <xy-dropdown>
    <a class="xy-dropdown-link" @click.prevent>
      Hover me
      <DownOutlined />
    </a>
    <template #overlay>
      <xy-menu>
        <xy-menu-item>
          <a href="javascript:;">1st menu item</a>
        </xy-menu-item>
        <xy-menu-item>
          <a href="javascript:;">2nd menu item</a>
        </xy-menu-item>
        <xy-menu-item>
          <a href="javascript:;">3rd menu item</a>
        </xy-menu-item>
      </xy-menu>
    </template>
  </xy-dropdown>
</template>
<script lang="ts" setup>
import { DownOutlined } from '@xiaoye-ui/icons';
</script>
