<template>
  <xy-tree-chart
    v-model:selection-keys="selectionKeys"
    selection-mode="multiple"
    :value="data"
    @node-select="onSelect"
    @node-unselect="onUnselect"
  >
    <template #default="{ node }">
      <div class="tree-node">
        <span class="label">{{ node.data.name }}</span>
        <span class="count">{{ node.data.count }}</span>
      </div>
    </template>
  </xy-tree-chart>

  <p class="tip">已选分类：{{ selectedNames.join('、') || '（暂无）' }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TreeChartNode } from 'xiaoye-ui';

const data: TreeChartNode = {
  key: '0',
  data: { name: '全部商品', count: 1280 },
  children: [
    {
      key: '0-0',
      data: { name: '数码电器', count: 320 },
      children: [
        { key: '0-0-0', data: { name: '手机', count: 120 } },
        { key: '0-0-1', data: { name: '笔记本', count: 80 } },
      ],
    },
    {
      key: '0-1',
      data: { name: '服饰鞋包', count: 560 },
      children: [
        { key: '0-1-0', data: { name: '男装', count: 200 } },
        { key: '0-1-1', data: { name: '女装', count: 360 } },
      ],
    },
  ],
};

const selectionKeys = ref<Record<string, boolean>>({});
const selectedNames = ref<string[]>([]);

function collectNames(node: TreeChartNode, keys: Record<string, boolean>, out: string[]) {
  if (keys[node.key as string]) out.push(node.data.name);
  (node.children || []).forEach(c => collectNames(c, keys, out));
}

function refresh() {
  const out: string[] = [];
  collectNames(data, selectionKeys.value, out);
  selectedNames.value = out;
}

function onSelect(_node: TreeChartNode) {
  refresh();
}
function onUnselect() {
  refresh();
}
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
.label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
}
.count {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.tip {
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
