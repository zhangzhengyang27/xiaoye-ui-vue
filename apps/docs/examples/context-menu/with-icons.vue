<template>
  <xy-context-menu :model="items" global>
    <template #itemicon="{ item }">
      <component :is="item.iconComponent" v-if="item.iconComponent" />
    </template>
  </xy-context-menu>
  <div class="context-menu-icons-area">右键点击查看带图标的菜单</div>
</template>

<script lang="ts" setup>
import {
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  FolderOpenOutlined,
  FileOutlined,
} from '@xiaoye-ui/icons';
import type { MenuItem } from 'xiaoye-ui';

const items: MenuItem[] = [
  {
    label: '复制',
    iconComponent: CopyOutlined,
    command: () => console.warn('复制'),
  },
  {
    label: '编辑',
    iconComponent: EditOutlined,
    command: () => console.warn('编辑'),
  },
  {
    label: '分享',
    iconComponent: ShareAltOutlined,
    command: () => console.warn('分享'),
  },
  {
    separator: true,
  },
  {
    label: '打开文件',
    iconComponent: FileOutlined,
    command: () => console.warn('打开文件'),
  },
  {
    label: '打开文件夹',
    iconComponent: FolderOpenOutlined,
    command: () => console.warn('打开文件夹'),
  },
  {
    separator: true,
  },
  {
    label: '删除',
    iconComponent: DeleteOutlined,
    disabled: true,
    command: () => console.warn('删除'),
  },
];
</script>

<style scoped>
.context-menu-icons-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f7f7f7;
  color: #777;
  border-radius: 4px;
}
</style>
