<template>
  <a-dropdown>
    <a class="ant-dropdown-link" @click.prevent>
      Cascading menu
      <DownOutlined />
    </a>
    <template #overlay>
      <a-menu>
        <a-menu-item>1st menu item</a-menu-item>
        <a-menu-item>2nd menu item</a-menu-item>
        <a-sub-menu key="sub1" title="sub menu">
          <a-menu-item>3rd menu item</a-menu-item>
          <a-menu-item>4th menu item</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2" title="disabled sub menu" disabled>
          <a-menu-item>5d menu item</a-menu-item>
          <a-menu-item>6th menu item</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';
</script>
