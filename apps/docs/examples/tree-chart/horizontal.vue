<template>
  <div class="scroll-wrapper">
    <xy-tree-chart :value="data">
      <template #default="{ node }">
        <div class="tree-node">
          <FolderOutlined v-if="node.data.kind === 'folder'" class="icon icon-folder" />
          <FileOutlined v-else class="icon icon-file" />
          <span class="label">{{ node.data.name }}</span>
        </div>
      </template>
    </xy-tree-chart>
  </div>
</template>

<script lang="ts" setup>
import { FolderOutlined, FileOutlined } from '@xiaoye-ui/icons';
import type { TreeChartNode } from 'xiaoye-ui';

// 构造一棵较深的树，演示横向滚动容器
const data: TreeChartNode = {
  key: '0',
  data: { name: 'L0', kind: 'folder' },
  children: [
    {
      key: '0-0',
      data: { name: 'L1-A', kind: 'folder' },
      children: [
        {
          key: '0-0-0',
          data: { name: 'L2-A', kind: 'folder' },
          children: [
            {
              key: '0-0-0-0',
              data: { name: 'L3-A', kind: 'folder' },
              children: [
                { key: '0-0-0-0-0', data: { name: 'L4-A', kind: 'file' } },
                { key: '0-0-0-0-1', data: { name: 'L4-B', kind: 'file' } },
              ],
            },
          ],
        },
      ],
    },
    {
      key: '0-1',
      data: { name: 'L1-B', kind: 'folder' },
      children: [
        {
          key: '0-1-0',
          data: { name: 'L2-B', kind: 'folder' },
          children: [{ key: '0-1-0-0', data: { name: 'L3-B', kind: 'file' } }],
        },
      ],
    },
  ],
};
</script>

<style scoped>
.scroll-wrapper {
  overflow-x: auto;
  padding-bottom: 8px;
}
.tree-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  white-space: nowrap;
  font-size: 13px;
}
.icon {
  font-size: 14px;
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
</style>
