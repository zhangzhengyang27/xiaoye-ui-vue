<template>
  <xy-organization-chart :value="data">
    <template #default="{ node }">
      <div class="org-node">
        <div class="org-node-name">{{ node.data.name }}</div>
        <div class="org-node-dept">{{ node.data.dept }}</div>
      </div>
    </template>
  </xy-organization-chart>
</template>

<script lang="ts" setup>
import type { OrganizationChartNode } from 'xiaoye-ui';

const data: OrganizationChartNode = {
  key: '0',
  data: { name: '张伟 · CEO', dept: '总经理办公室' },
  children: [
    {
      key: '0-0',
      data: { name: '李娜 · 技术总监', dept: '技术部' },
      children: [
        { key: '0-0-0', data: { name: '王强 · 前端组长', dept: '前端组' } },
        { key: '0-0-1', data: { name: '赵敏 · 后端组长', dept: '后端组' } },
      ],
    },
    {
      key: '0-1',
      data: { name: '陈晨 · 市场总监', dept: '市场部' },
      children: [
        { key: '0-1-0', data: { name: '刘洋 · 运营', dept: '运营组' } },
        { key: '0-1-1', data: { name: '周杰 · 销售', dept: '销售组' } },
      ],
    },
  ],
};
</script>

<style scoped>
.org-node {
  padding: 12px 18px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  text-align: center;
  min-width: 120px;
}
.org-node-name {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}
.org-node-dept {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
