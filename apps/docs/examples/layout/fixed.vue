<template>
  <xy-layout>
    <xy-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <div class="logo" />
      <xy-menu
        v-model:selected-keys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <xy-menu-item key="1">nav 1</xy-menu-item>
        <xy-menu-item key="2">nav 2</xy-menu-item>
        <xy-menu-item key="3">nav 3</xy-menu-item>
      </xy-menu>
    </xy-layout-header>
    <xy-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <xy-breadcrumb :style="{ margin: '16px 0' }">
        <xy-breadcrumb-item>Home</xy-breadcrumb-item>
        <xy-breadcrumb-item>List</xy-breadcrumb-item>
        <xy-breadcrumb-item>App</xy-breadcrumb-item>
      </xy-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '380px' }">Content</div>
    </xy-layout-content>
    <xy-layout-footer :style="{ textAlign: 'center' }">
      Xiaoye UI ©2024 Created by Xiaoye UI
    </xy-layout-footer>
  </xy-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const selectedKeys = ref<string[]>(['2']);
</script>
<style scoped>
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
