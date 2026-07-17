<template>
  <xy-space direction="vertical" :style="{ width: '100%' }" :size="[0, 48]">
    <xy-layout>
      <xy-layout-header :style="headerStyle">Header</xy-layout-header>
      <xy-layout-content :style="contentStyle">Content</xy-layout-content>
      <xy-layout-footer :style="footerStyle">Footer</xy-layout-footer>
    </xy-layout>

    <xy-layout>
      <xy-layout-header :style="headerStyle">Header</xy-layout-header>
      <xy-layout>
        <xy-layout-sider :style="siderStyle">Sider</xy-layout-sider>
        <xy-layout-content :style="contentStyle">Content</xy-layout-content>
      </xy-layout>
      <xy-layout-footer :style="footerStyle">Footer</xy-layout-footer>
    </xy-layout>

    <xy-layout>
      <xy-layout-header :style="headerStyle">Header</xy-layout-header>
      <xy-layout>
        <xy-layout-content :style="contentStyle">Content</xy-layout-content>
        <xy-layout-sider :style="siderStyle">Sider</xy-layout-sider>
      </xy-layout>
      <xy-layout-footer :style="footerStyle">Footer</xy-layout-footer>
    </xy-layout>

    <xy-layout>
      <xy-layout-sider :style="siderStyle">Sider</xy-layout-sider>
      <xy-layout>
        <xy-layout-header :style="headerStyle">Header</xy-layout-header>
        <xy-layout-content :style="contentStyle">Content</xy-layout-content>
        <xy-layout-footer :style="footerStyle">Footer</xy-layout-footer>
      </xy-layout>
    </xy-layout>
  </xy-space>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';
const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};

const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
};

const siderStyle: CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9',
};

const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};
</script>
