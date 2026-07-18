<template>
  <!-- 多选目录树：按住 ctrl/command 追加选中，shift 范围选中 -->
  <xy-directory-tree
    v-model:expanded-keys="expandedKeys"
    v-model:selected-keys="selectedKeys"
    multiple
    :tree-data="treeData"
  ></xy-directory-tree>
</template>
<script lang="ts" setup>
import type { TreeProps } from 'xiaoye-ui';
import { ref } from 'vue';

const expandedKeys = ref<string[]>(['0-0', '0-1']);
const selectedKeys = ref<string[]>([]);
const treeData: TreeProps['treeData'] = [
  {
    title: 'documents',
    key: '0-0',
    children: [
      { title: 'resume.pdf', key: '0-0-0', isLeaf: true },
      { title: 'notes.md', key: '0-0-1', isLeaf: true },
    ],
  },
  {
    title: 'pictures',
    key: '0-1',
    children: [
      { title: 'avatar.png', key: '0-1-0', isLeaf: true },
      { title: 'banner.jpg', key: '0-1-1', isLeaf: true },
    ],
  },
  {
    title: 'music',
    key: '0-2',
    children: [
      { title: 'song.mp3', key: '0-2-0', isLeaf: true },
      { title: 'playlist.m3u', key: '0-2-1', isLeaf: true },
    ],
  },
];
</script>
