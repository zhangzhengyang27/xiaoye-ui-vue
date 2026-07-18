<template>
  <!-- 垂直布局：菜单纵向排列，子菜单从右侧展开 -->
  <div style="display: inline-block; min-width: 220px">
    <xy-mega-menu v-model:active-item="activeKey" :model="model" orientation="vertical" />
  </div>
  <p style="margin-top: 12px; color: #888">当前激活项：{{ activeKey || '无' }}</p>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { MegaMenuItem } from 'xiaoye-ui';

const activeKey = ref<string>('');

const model: MegaMenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    items: [
      [
        {
          label: '概览',
          items: [
            { key: 'overview-1', label: '销售概览' },
            { key: 'overview-2', label: '流量概览' },
          ],
        },
      ],
      [
        {
          label: '分析',
          items: [
            { key: 'analytics-1', label: '用户分析' },
            { key: 'analytics-2', label: '订单分析' },
          ],
        },
      ],
    ],
  },
  {
    key: 'content',
    label: '内容管理',
    items: [
      [
        {
          label: '文章',
          items: [{ key: 'post-1', label: '所有文章' }],
        },
      ],
    ],
  },
  {
    key: 'help',
    label: '帮助中心',
  },
];
</script>
