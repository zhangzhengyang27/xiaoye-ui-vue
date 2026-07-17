<template>
  <xy-context-menu :model="items" global />
  <div class="context-menu-basic-area">在页面任意位置点击鼠标右键</div>
</template>

<script lang="ts" setup>
import type { MenuItem } from 'xiaoye-ui';

const items: MenuItem[] = [
  {
    label: '复制',
    command: ({ item }) => {
      console.warn('点击了复制', item.label);
    },
  },
  {
    label: '编辑',
    command: () => {
      console.warn('点击了编辑');
    },
  },
  {
    separator: true,
  },
  {
    label: '分享',
    command: () => {
      console.warn('点击了分享');
    },
  },
  {
    label: '删除',
    disabled: true,
    command: () => {
      console.warn('点击了删除');
    },
  },
];
</script>

<style scoped>
.context-menu-basic-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f7f7f7;
  color: #777;
  border-radius: 4px;
}
</style>
