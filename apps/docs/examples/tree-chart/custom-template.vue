<template>
  <xy-tree-chart :value="data">
    <template #question="{ node }">
      <div class="node node-question">
        <span class="tag tag-q">判断</span>
        <span class="text">{{ node.data.label }}</span>
      </div>
    </template>
    <template #action="{ node }">
      <div class="node node-action">
        <span class="tag tag-a">动作</span>
        <span class="text">{{ node.data.label }}</span>
      </div>
    </template>
    <template #result="{ node }">
      <div class="node node-result">
        <span class="tag tag-r">结果</span>
        <span class="text">{{ node.data.label }}</span>
      </div>
    </template>
  </xy-tree-chart>
</template>

<script lang="ts" setup>
import type { TreeChartNode } from 'xiaoye-ui';

const data: TreeChartNode = {
  key: '0',
  type: 'question',
  data: { label: '用户余额是否大于 100？' },
  children: [
    {
      key: '0-0',
      type: 'question',
      data: { label: '是否为 VIP 用户？' },
      children: [
        { key: '0-0-0', type: 'action', data: { label: '发放大额优惠券' } },
        { key: '0-0-1', type: 'action', data: { label: '推荐高价值商品' } },
      ],
    },
    {
      key: '0-1',
      type: 'question',
      data: { label: '是否近 30 天活跃？' },
      children: [
        { key: '0-1-0', type: 'action', data: { label: '发放小额优惠券' } },
        { key: '0-1-1', type: 'result', data: { label: '进入唤醒流程' } },
      ],
    },
  ],
};
</script>

<style scoped>
.node {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
}
.node-question {
  border: 1px solid #1677ff;
}
.node-action {
  border: 1px solid #52c41a;
}
.node-result {
  border: 1px solid #ff4d4f;
}
.tag {
  padding: 1px 8px;
  font-size: 12px;
  color: #fff;
  border-radius: 10px;
}
.tag-q {
  background: #1677ff;
}
.tag-a {
  background: #52c41a;
}
.tag-r {
  background: #ff4d4f;
}
.text {
  color: rgba(0, 0, 0, 0.88);
}
</style>
