<template>
  <xy-layout style="min-height: 100vh">
    <xy-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <xy-menu v-model:selected-keys="selectedKeys" theme="dark" mode="inline">
        <xy-menu-item key="1">
          <pie-chart-outlined />
          <span>Option 1</span>
        </xy-menu-item>
        <xy-menu-item key="2">
          <desktop-outlined />
          <span>Option 2</span>
        </xy-menu-item>
        <xy-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>User</span>
            </span>
          </template>
          <xy-menu-item key="3">Tom</xy-menu-item>
          <xy-menu-item key="4">Bill</xy-menu-item>
          <xy-menu-item key="5">Alex</xy-menu-item>
        </xy-sub-menu>
        <xy-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>Team</span>
            </span>
          </template>
          <xy-menu-item key="6">Team 1</xy-menu-item>
          <xy-menu-item key="8">Team 2</xy-menu-item>
        </xy-sub-menu>
        <xy-menu-item key="9">
          <file-outlined />
          <span>File</span>
        </xy-menu-item>
      </xy-menu>
    </xy-layout-sider>
    <xy-layout>
      <xy-layout-header style="background: #fff; padding: 0" />
      <xy-layout-content style="margin: 0 16px">
        <xy-breadcrumb style="margin: 16px 0">
          <xy-breadcrumb-item>User</xy-breadcrumb-item>
          <xy-breadcrumb-item>Bill</xy-breadcrumb-item>
        </xy-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          Bill is a cat.
        </div>
      </xy-layout-content>
      <xy-layout-footer style="text-align: center">
        Xiaoye UI ©2024 Created by Xiaoye UI
      </xy-layout-footer>
    </xy-layout>
  </xy-layout>
</template>
<script lang="ts" setup>
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
} from '@xiaoye-ui/icons';
import { ref } from 'vue';
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
</script>

<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
