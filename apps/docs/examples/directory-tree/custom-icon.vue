<template>
  <!-- 自定义节点图标：通过 icon 插槽覆盖默认的文件夹/文件图标 -->
  <xy-directory-tree
    v-model:expanded-keys="expandedKeys"
    v-model:selected-keys="selectedKeys"
    :tree-data="treeData"
  >
    <template #icon="{ isLeaf, expanded }">
      <span v-if="isLeaf" style="color: #52c41a">📄</span>
      <span v-else style="color: #1890ff">{{ expanded ? '📂' : '📁' }}</span>
    </template>
  </xy-directory-tree>
</template>
<script lang="ts" setup>
import type { TreeProps } from 'xiaoye-ui';
import { ref } from 'vue';

const expandedKeys = ref<string[]>(['0-0']);
const selectedKeys = ref<string[]>([]);
const treeData: TreeProps['treeData'] = [
  {
    title: 'project',
    key: '0-0',
    children: [
      { title: 'README.md', key: '0-0-0', isLeaf: true },
      { title: 'package.json', key: '0-0-1', isLeaf: true },
      {
        title: 'src',
        key: '0-0-2',
        children: [{ title: 'main.ts', key: '0-0-2-0', isLeaf: true }],
      },
    ],
  },
];
</script>
