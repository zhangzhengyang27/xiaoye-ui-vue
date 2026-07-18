<template>
  <!-- 默认展开全部节点 -->
  <xy-directory-tree
    v-model:selected-keys="selectedKeys"
    default-expand-all
    :tree-data="treeData"
  ></xy-directory-tree>
</template>
<script lang="ts" setup>
import type { TreeProps } from 'xiaoye-ui';
import { ref } from 'vue';

const selectedKeys = ref<string[]>([]);
const treeData: TreeProps['treeData'] = [
  {
    title: 'workspace',
    key: '0-0',
    children: [
      {
        title: 'frontend',
        key: '0-0-0',
        children: [
          { title: 'package.json', key: '0-0-0-0', isLeaf: true },
          { title: 'vite.config.ts', key: '0-0-0-1', isLeaf: true },
        ],
      },
      {
        title: 'backend',
        key: '0-0-1',
        children: [
          { title: 'server.js', key: '0-0-1-0', isLeaf: true },
          { title: 'Dockerfile', key: '0-0-1-1', isLeaf: true },
        ],
      },
    ],
  },
];
</script>
