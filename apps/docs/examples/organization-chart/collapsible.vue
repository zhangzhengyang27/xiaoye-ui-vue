<template>
  <xy-organization-chart
    v-model:collapsed-keys="collapsedKeys"
    collapsible
    :value="data"
    @node-expand="onExpand"
    @node-collapse="onCollapse"
  >
    <template #default="{ node }">
      <div class="org-node">
        <div class="org-node-name">{{ node.data.name }}</div>
        <div class="org-node-dept">{{ node.data.dept }}</div>
      </div>
    </template>
  </xy-organization-chart>

  <p class="tip">点击节点下方的箭头可折叠 / 展开。最近操作：{{ lastAction || '（暂无）' }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { OrganizationChartNode } from 'xiaoye-ui';

const data: OrganizationChartNode = {
  key: '0',
  data: { name: '集团总部', dept: 'HQ' },
  children: [
    {
      key: '0-0',
      data: { name: '华北分部', dept: 'North' },
      children: [
        { key: '0-0-0', data: { name: '北京办事处', dept: 'BJ' } },
        { key: '0-0-1', data: { name: '天津办事处', dept: 'TJ' } },
      ],
    },
    {
      key: '0-1',
      data: { name: '华南分部', dept: 'South' },
      children: [
        { key: '0-1-0', data: { name: '广州办事处', dept: 'GZ' } },
        { key: '0-1-1', data: { name: '深圳办事处', dept: 'SZ' } },
      ],
    },
  ],
};

const collapsedKeys = ref<Record<string, boolean>>({ '0-0': true });
const lastAction = ref('');

function onExpand(node: OrganizationChartNode) {
  lastAction.value = `展开「${node.data.name}」`;
}

function onCollapse(node: OrganizationChartNode) {
  lastAction.value = `折叠「${node.data.name}」`;
}
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
.tip {
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
