<template>
  <!-- 多个展开：设置 multiple 为 true，可同时展开多个面板 -->
  <xy-panel-menu :model="model" multiple style="width: 280px" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { PanelMenuItem } from 'xiaoye-ui';

const model = ref<PanelMenuItem[]>([
  {
    key: '1',
    label: '仪表盘',
    items: [
      { key: '1_0', label: '概览' },
      { key: '1_1', label: '统计分析' },
    ],
  },
  {
    key: '2',
    label: '订单管理',
    items: [
      { key: '2_0', label: '全部订单' },
      { key: '2_1', label: '待付款' },
      { key: '2_2', label: '已发货' },
    ],
  },
  {
    key: '3',
    label: '商品管理',
    items: [
      { key: '3_0', label: '商品列表' },
      { key: '3_1', label: '分类管理' },
      { key: '3_2', label: '库存管理' },
    ],
  },
]);
</script>
