<template>
  <xy-organization-chart :value="data">
    <template #company="{ node }">
      <div class="node node-company">
        <span class="badge">总部</span>
        <div class="name">{{ node.data.name }}</div>
      </div>
    </template>
    <template #department="{ node }">
      <div class="node node-department">
        <span class="badge">部门</span>
        <div class="name">{{ node.data.name }}</div>
        <div class="meta">{{ node.data.members }} 人</div>
      </div>
    </template>
    <template #team="{ node }">
      <div class="node node-team">
        <span class="badge">小组</span>
        <div class="name">{{ node.data.name }}</div>
      </div>
    </template>
  </xy-organization-chart>
</template>

<script lang="ts" setup>
import type { OrganizationChartNode } from 'xiaoye-ui';

const data: OrganizationChartNode = {
  key: '0',
  type: 'company',
  data: { name: 'XiaoyeUI 科技' },
  children: [
    {
      key: '0-0',
      type: 'department',
      data: { name: '技术研发部', members: 48 },
      children: [
        { key: '0-0-0', type: 'team', data: { name: '前端基础组' } },
        { key: '0-0-1', type: 'team', data: { name: '基础架构组' } },
      ],
    },
    {
      key: '0-1',
      type: 'department',
      data: { name: '产品设计部', members: 16 },
      children: [{ key: '0-1-0', type: 'team', data: { name: '交互设计组' } }],
    },
  ],
};
</script>

<style scoped>
.node {
  padding: 10px 16px;
  border-radius: 6px;
  background: #fff;
  text-align: center;
  min-width: 130px;
}
.node-company {
  border: 2px solid #1677ff;
}
.node-department {
  border: 1px solid #52c41a;
}
.node-team {
  border: 1px dashed #faad14;
}
.badge {
  display: inline-block;
  padding: 1px 8px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #fff;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.45);
}
.node-company .badge {
  background: #1677ff;
}
.node-department .badge {
  background: #52c41a;
}
.node-team .badge {
  background: #faad14;
}
.name {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}
.meta {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
