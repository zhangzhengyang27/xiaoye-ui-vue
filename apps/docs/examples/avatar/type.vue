<template>
  <xy-space :size="16" wrap>
    <xy-avatar>
      <template #icon>
        <UserOutlined />
      </template>
    </xy-avatar>
    <xy-avatar>U</xy-avatar>
    <xy-avatar :size="40">USER</xy-avatar>
    <xy-avatar src="https://www.xiaoye-ui.github.io/assets/logo.1ef800a8.svg" />
    <xy-avatar style="color: #f56a00; background-color: #fde3cf">U</xy-avatar>
    <xy-avatar style="background-color: #87d068">
      <template #icon>
        <UserOutlined />
      </template>
    </xy-avatar>
  </xy-space>
</template>

<script lang="ts" setup>
import { UserOutlined } from '@xiaoye-ui/icons';
</script>
