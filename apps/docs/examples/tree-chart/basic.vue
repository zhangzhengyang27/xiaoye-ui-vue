<template>
  <xy-tree-chart :value="data">
    <template #default="{ node }">
      <div class="tree-node">
        <FolderOutlined v-if="node.data.kind === 'folder'" class="icon icon-folder" />
        <FileOutlined v-else class="icon icon-file" />
        <span class="label">{{ node.data.name }}</span>
        <span v-if="node.data.size" class="size">{{ node.data.size }}</span>
      </div>
    </template>
  </xy-tree-chart>
</template>

<script lang="ts" setup>
import { FolderOutlined, FileOutlined } from '@xiaoye-ui/icons';
import type { TreeChartNode } from 'xiaoye-ui';

const data: TreeChartNode = {
  key: '0',
  data: { name: 'project', kind: 'folder' },
  children: [
    {
      key: '0-0',
      data: { name: 'src', kind: 'folder' },
      children: [
        { key: '0-0-0', data: { name: 'main.ts', kind: 'file', size: '2KB' } },
        { key: '0-0-1', data: { name: 'App.vue', kind: 'file', size: '5KB' } },
        {
          key: '0-0-2',
          data: { name: 'components', kind: 'folder' },
          children: [
            { key: '0-0-2-0', data: { name: 'Header.vue', kind: 'file', size: '3KB' } },
            { key: '0-0-2-1', data: { name: 'Footer.vue', kind: 'file', size: '1KB' } },
          ],
        },
      ],
    },
    {
      key: '0-1',
      data: { name: 'public', kind: 'folder' },
      children: [{ key: '0-1-0', data: { name: 'favicon.ico', kind: 'file', size: '4KB' } }],
    },
  ],
};
</script>

<style scoped>
.tree-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
}
.icon {
  font-size: 16px;
}
.icon-folder {
  color: #faad14;
}
.icon-file {
  color: rgba(0, 0, 0, 0.45);
}
.label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
}
.size {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
