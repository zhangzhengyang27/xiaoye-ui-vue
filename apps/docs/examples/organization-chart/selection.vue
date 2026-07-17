<template>
  <xy-organization-chart
    v-model:selection-keys="selectionKeys"
    selection-mode="single"
    :value="data"
    @node-select="onSelect"
    @node-unselect="onUnselect"
  >
    <template #default="{ node }">
      <div class="org-node">
        <div class="org-node-name">{{ node.data.name }}</div>
        <div class="org-node-dept">{{ node.data.dept }}</div>
      </div>
    </template>
  </xy-organization-chart>

  <p class="tip">当前选中：{{ selectedName || '（暂无）' }}</p>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { OrganizationChartNode } from 'xiaoye-ui';

const data: OrganizationChartNode = {
  key: '0',
  data: { name: '产品中心', dept: 'Product' },
  children: [
    {
      key: '0-0',
      data: { name: '设计组', dept: 'Design' },
      children: [
        { key: '0-0-0', data: { name: '交互设计', dept: 'UX' } },
        { key: '0-0-1', data: { name: '视觉设计', dept: 'UI' } },
      ],
    },
    {
      key: '0-1',
      data: { name: '研发组', dept: 'R&D' },
      children: [{ key: '0-1-0', data: { name: '前端工程', dept: 'Web' } }],
    },
  ],
};

const selectionKeys = ref<Record<string, boolean>>({});
const selectedNode = ref<OrganizationChartNode | null>(null);

const selectedName = computed(() => selectedNode.value?.data?.name || '');

function onSelect(node: OrganizationChartNode) {
  selectedNode.value = node;
}

function onUnselect(node: OrganizationChartNode) {
  if (selectedNode.value?.key === node.key) selectedNode.value = null;
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
