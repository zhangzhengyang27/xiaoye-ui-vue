<template>
  <xy-layout>
    <xy-layout-header class="header">
      <div class="logo" />
      <xy-menu
        v-model:selected-keys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <xy-menu-item key="1">nav 1</xy-menu-item>
        <xy-menu-item key="2">nav 2</xy-menu-item>
        <xy-menu-item key="3">nav 3</xy-menu-item>
      </xy-menu>
    </xy-layout-header>
    <xy-layout>
      <xy-layout-sider width="200" style="background: #fff">
        <xy-menu
          v-model:selected-keys="selectedKeys2"
          v-model:open-keys="openKeys"
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <xy-sub-menu key="sub1">
            <template #title>
              <span>
                <user-outlined />
                subnav 1
              </span>
            </template>
            <xy-menu-item key="1">option1</xy-menu-item>
            <xy-menu-item key="2">option2</xy-menu-item>
            <xy-menu-item key="3">option3</xy-menu-item>
            <xy-menu-item key="4">option4</xy-menu-item>
          </xy-sub-menu>
          <xy-sub-menu key="sub2">
            <template #title>
              <span>
                <laptop-outlined />
                subnav 2
              </span>
            </template>
            <xy-menu-item key="5">option5</xy-menu-item>
            <xy-menu-item key="6">option6</xy-menu-item>
            <xy-menu-item key="7">option7</xy-menu-item>
            <xy-menu-item key="8">option8</xy-menu-item>
          </xy-sub-menu>
          <xy-sub-menu key="sub3">
            <template #title>
              <span>
                <notification-outlined />
                subnav 3
              </span>
            </template>
            <xy-menu-item key="9">option9</xy-menu-item>
            <xy-menu-item key="10">option10</xy-menu-item>
            <xy-menu-item key="11">option11</xy-menu-item>
            <xy-menu-item key="12">option12</xy-menu-item>
          </xy-sub-menu>
        </xy-menu>
      </xy-layout-sider>
      <xy-layout style="padding: 0 24px 24px">
        <xy-breadcrumb style="margin: 16px 0">
          <xy-breadcrumb-item>Home</xy-breadcrumb-item>
          <xy-breadcrumb-item>List</xy-breadcrumb-item>
          <xy-breadcrumb-item>App</xy-breadcrumb-item>
        </xy-breadcrumb>
        <xy-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
          Content
        </xy-layout-content>
      </xy-layout>
    </xy-layout>
  </xy-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@xiaoye-ui/icons';
const selectedKeys1 = ref<string[]>(['2']);
const selectedKeys2 = ref<string[]>(['1']);
const openKeys = ref<string[]>(['sub1']);
</script>

<style scoped>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.xy-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
