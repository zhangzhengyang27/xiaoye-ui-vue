<template>
  <xy-avatar-group>
    <xy-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
    <a href="https://www.xiaoye-ui.github.io">
      <xy-avatar style="background-color: #f56a00">K</xy-avatar>
    </a>
    <xy-tooltip title="Ant User" placement="top">
      <xy-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </xy-avatar>
    </xy-tooltip>
    <xy-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </xy-avatar>
  </xy-avatar-group>
  <xy-divider />
  <xy-avatar-group :max-count="2" :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf' }">
    <xy-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
    <xy-avatar style="background-color: #1890ff">K</xy-avatar>
    <xy-tooltip title="Ant User" placement="top">
      <xy-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </xy-avatar>
    </xy-tooltip>
    <xy-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </xy-avatar>
  </xy-avatar-group>
  <xy-divider />
  <xy-avatar-group
    :max-count="2"
    size="large"
    :max-style="{
      color: '#f56a00',
      backgroundColor: '#fde3cf',
    }"
  >
    <xy-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" />
    <xy-avatar style="background-color: #1890ff">K</xy-avatar>
    <xy-tooltip title="Ant User" placement="top">
      <xy-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </xy-avatar>
    </xy-tooltip>
    <xy-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </xy-avatar>
  </xy-avatar-group>
  <xy-divider />
  <xy-avatar-group
    :max-count="2"
    max-popover-trigger="click"
    size="large"
    :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }"
  >
    <xy-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <xy-avatar style="background-color: #f56a00">K</xy-avatar>
    <xy-tooltip title="Ant User" placement="top">
      <xy-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </xy-avatar>
    </xy-tooltip>
    <xy-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </xy-avatar>
  </xy-avatar-group>
  <xy-divider />
  <xy-avatar-group shape="square">
    <xy-avatar style="background-color: #fde3cf">A</xy-avatar>
    <xy-avatar style="background-color: #f56a00">K</xy-avatar>
    <xy-tooltip title="Ant User" placement="top">
      <xy-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </xy-avatar>
    </xy-tooltip>
    <xy-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </xy-avatar>
  </xy-avatar-group>
</template>

<script lang="ts" setup>
import { UserOutlined, AntDesignOutlined } from '@xiaoye-ui/icons';
</script>
