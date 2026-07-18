<template>
  <!-- 带图标：菜单项支持 icon 字段，传入图标类名 -->
  <xy-panel-menu :model="model" style="width: 280px" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { PanelMenuItem } from 'xiaoye-ui';

const model = ref<PanelMenuItem[]>([
  {
    key: '1',
    label: '用户管理',
    icon: 'xyicon-user',
    items: [
      { key: '1_0', label: '新增用户', icon: 'xyicon-user-plus' },
      { key: '1_1', label: '删除用户', icon: 'xyicon-user-minus' },
      { key: '1_2', label: '用户列表', icon: 'xyicon-users' },
    ],
  },
  {
    key: '2',
    label: '文件管理',
    icon: 'xyicon-folder',
    items: [
      { key: '2_0', label: '上传文件', icon: 'xyicon-upload' },
      { key: '2_1', label: '下载文件', icon: 'xyicon-download' },
    ],
  },
  {
    key: '3',
    label: '系统设置',
    icon: 'xyicon-settings',
    items: [
      { key: '3_0', label: '基本设置' },
      { key: '3_1', label: '安全设置' },
    ],
  },
]);
</script>
