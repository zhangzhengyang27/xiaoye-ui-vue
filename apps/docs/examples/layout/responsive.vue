<template>
  <xy-layout>
    <xy-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo" />
      <xy-menu v-model:selected-keys="selectedKeys" theme="dark" mode="inline">
        <xy-menu-item key="1">
          <user-outlined />
          <span class="nav-text">nav 1</span>
        </xy-menu-item>
        <xy-menu-item key="2">
          <video-camera-outlined />
          <span class="nav-text">nav 2</span>
        </xy-menu-item>
        <xy-menu-item key="3">
          <upload-outlined />
          <span class="nav-text">nav 3</span>
        </xy-menu-item>
        <xy-menu-item key="4">
          <user-outlined />
          <span class="nav-text">nav 4</span>
        </xy-menu-item>
      </xy-menu>
    </xy-layout-sider>
    <xy-layout>
      <xy-layout-header :style="{ background: '#fff', padding: 0 }" />
      <xy-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">content</div>
      </xy-layout-content>
      <xy-layout-footer style="text-align: center">
        Xiaoye UI ©2024 Created by Xiaoye UI
      </xy-layout-footer>
    </xy-layout>
  </xy-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from '@xiaoye-ui/icons';
const onCollapse = (collapsed: boolean, type: string) => {
  console.log(collapsed, type);
};

const onBreakpoint = (broken: boolean) => {
  console.log(broken);
};

const selectedKeys = ref<string[]>(['4']);
</script>

<style scoped>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}
</style>
