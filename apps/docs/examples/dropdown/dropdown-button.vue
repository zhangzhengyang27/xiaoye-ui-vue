<template>
  <div class="demo-dropdown-wrap">
    <xy-dropdown-button @click="handleButtonClick">
      Dropdown
      <template #overlay>
        <xy-menu @click="handleMenuClick">
          <xy-menu-item key="1">
            <UserOutlined />
            1st menu item
          </xy-menu-item>
          <xy-menu-item key="2">
            <UserOutlined />
            2nd menu item
          </xy-menu-item>
          <xy-menu-item key="3">
            <UserOutlined />
            3rd item
          </xy-menu-item>
        </xy-menu>
      </template>
    </xy-dropdown-button>
    <xy-dropdown-button>
      Dropdown
      <template #overlay>
        <xy-menu @click="handleMenuClick">
          <xy-menu-item key="1">
            <UserOutlined />
            1st menu item
          </xy-menu-item>
          <xy-menu-item key="2">
            <UserOutlined />
            2nd menu item
          </xy-menu-item>
          <xy-menu-item key="3">
            <UserOutlined />
            3rd item
          </xy-menu-item>
        </xy-menu>
      </template>
      <template #icon><UserOutlined /></template>
    </xy-dropdown-button>
    <xy-dropdown-button disabled @click="handleButtonClick">
      Dropdown
      <template #overlay>
        <xy-menu @click="handleMenuClick">
          <xy-menu-item key="1">
            <UserOutlined />
            1st menu item
          </xy-menu-item>
          <xy-menu-item key="2">
            <UserOutlined />
            2nd menu item
          </xy-menu-item>
          <xy-menu-item key="3">
            <UserOutlined />
            3rd item
          </xy-menu-item>
        </xy-menu>
      </template>
    </xy-dropdown-button>
    <xy-dropdown>
      <template #overlay>
        <xy-menu @click="handleMenuClick">
          <xy-menu-item key="1">
            <UserOutlined />
            1st menu item
          </xy-menu-item>
          <xy-menu-item key="2">
            <UserOutlined />
            2nd menu item
          </xy-menu-item>
          <xy-menu-item key="3">
            <UserOutlined />
            3rd item
          </xy-menu-item>
        </xy-menu>
      </template>
      <xy-button>
        Button
        <DownOutlined />
      </xy-button>
    </xy-dropdown>
  </div>
</template>
<script lang="ts" setup>
import { UserOutlined, DownOutlined } from '@xiaoye-ui/icons';
import type { MenuProps } from 'xiaoye-ui';
const handleButtonClick = (e: Event) => {
  console.log('click left button', e);
};
const handleMenuClick: MenuProps['onClick'] = e => {
  console.log('click', e);
};
</script>
<style lang="less" scoped>
.demo-dropdown-wrap :deep(.xy-dropdown-button) {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
