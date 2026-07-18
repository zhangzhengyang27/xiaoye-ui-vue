<template>
  <!-- 基础目录树：默认显示文件夹/文件图标，单击展开 -->
  <xy-directory-tree
    v-model:expanded-keys="expandedKeys"
    v-model:selected-keys="selectedKeys"
    :tree-data="treeData"
  ></xy-directory-tree>
</template>
<script lang="ts" setup>
import type { TreeProps } from 'xiaoye-ui';
import { ref } from 'vue';

const expandedKeys = ref<string[]>(['0-0']);
const selectedKeys = ref<string[]>([]);
const treeData: TreeProps['treeData'] = [
  {
    title: 'src',
    key: '0-0',
    children: [
      { title: 'index.ts', key: '0-0-0', isLeaf: true },
      { title: 'App.vue', key: '0-0-1', isLeaf: true },
      {
        title: 'components',
        key: '0-0-2',
        children: [
          { title: 'Button.tsx', key: '0-0-2-0', isLeaf: true },
          { title: 'Input.tsx', key: '0-0-2-1', isLeaf: true },
        ],
      },
    ],
  },
  {
    title: 'public',
    key: '0-1',
    children: [
      { title: 'favicon.ico', key: '0-1-0', isLeaf: true },
      { title: 'logo.svg', key: '0-1-1', isLeaf: true },
    ],
  },
];
</script>
