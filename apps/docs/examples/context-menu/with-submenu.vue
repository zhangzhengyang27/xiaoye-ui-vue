<template>
  <xy-context-menu :model="items" global />
  <div class="context-menu-submenu-area">右键点击查看多级菜单</div>
</template>

<script lang="ts" setup>
import type { MenuItem } from 'xiaoye-ui';

const items: MenuItem[] = [
  {
    label: '文件',
    items: [
      {
        label: '新建文件',
        command: () => console.warn('新建文件'),
      },
      {
        label: '新建文件夹',
        command: () => console.warn('新建文件夹'),
      },
      {
        separator: true,
      },
      {
        label: '打开最近',
        items: [
          {
            label: '项目 A',
            command: () => console.warn('打开项目 A'),
          },
          {
            label: '项目 B',
            command: () => console.warn('打开项目 B'),
          },
          {
            label: '项目 C',
            command: () => console.warn('打开项目 C'),
          },
        ],
      },
    ],
  },
  {
    label: '编辑',
    items: [
      {
        label: '撤销',
        command: () => console.warn('撤销'),
      },
      {
        label: '重做',
        command: () => console.warn('重做'),
      },
      {
        separator: true,
      },
      {
        label: '剪切',
        command: () => console.warn('剪切'),
      },
      {
        label: '复制',
        command: () => console.warn('复制'),
      },
      {
        label: '粘贴',
        command: () => console.warn('粘贴'),
      },
    ],
  },
  {
    separator: true,
  },
  {
    label: '查看',
    items: [
      {
        label: '命令面板',
        command: () => console.warn('命令面板'),
      },
      {
        label: '放大',
        command: () => console.warn('放大'),
      },
      {
        label: '缩小',
        command: () => console.warn('缩小'),
      },
    ],
  },
];
</script>

<style scoped>
.context-menu-submenu-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f7f7f7;
  color: #777;
  border-radius: 4px;
}
</style>
