<template>
  <xy-tree-chart :value="data">
    <template #default="{ node }">
      <div class="tree-node">
        <span class="dot" :class="node.styleClass" />
        <span class="label">{{ node.data.name }}</span>
        <span class="status">{{ node.data.status }}</span>
      </div>
    </template>
  </xy-tree-chart>
</template>

<script lang="ts" setup>
import type { TreeChartNode } from 'xiaoye-ui';

const data: TreeChartNode = {
  key: '0',
  styleClass: 'status-running',
  data: { name: '生产环境', status: '运行中' },
  children: [
    {
      key: '0-0',
      styleClass: 'status-running',
      data: { name: 'Web 集群', status: '运行中' },
      children: [
        { key: '0-0-0', styleClass: 'status-running', data: { name: 'web-01', status: '运行中' } },
        { key: '0-0-1', styleClass: 'status-warning', data: { name: 'web-02', status: '告警' } },
      ],
    },
    {
      key: '0-1',
      styleClass: 'status-error',
      data: { name: 'Worker 集群', status: '异常' },
      children: [
        { key: '0-1-0', styleClass: 'status-error', data: { name: 'worker-01', status: '宕机' } },
        { key: '0-1-1', styleClass: 'status-idle', data: { name: 'worker-02', status: '空闲' } },
      ],
    },
  ],
};
</script>

<style scoped>
.tree-node {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d9d9d9;
}
.dot.status-running {
  background: #52c41a;
}
.dot.status-warning {
  background: #faad14;
}
.dot.status-error {
  background: #ff4d4f;
}
.dot.status-idle {
  background: #bfbfbf;
}
.label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
}
.status {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
