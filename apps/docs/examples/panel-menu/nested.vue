<template>
  <!-- 多级嵌套：子菜单项通过 items 继续嵌套，形成多级树形结构 -->
  <xy-panel-menu :model="model" :expanded-keys="expandedKeys" style="width: 280px" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { PanelMenuItem } from 'xiaoye-ui';

// 默认展开第一层和子层
const expandedKeys = ref<Record<string, boolean>>({
  '2': true,
  '2_2': true,
});

const model = ref<PanelMenuItem[]>([
  {
    key: '1',
    label: '首页',
    items: [{ key: '1_0', label: '工作台' }],
  },
  {
    key: '2',
    label: '用户中心',
    items: [
      { key: '2_0', label: '个人资料' },
      { key: '2_1', label: '账户安全' },
      {
        key: '2_2',
        label: '消息通知',
        items: [
          { key: '2_2_0', label: '系统消息' },
          { key: '2_2_1', label: '站内信' },
          {
            key: '2_2_2',
            label: '订阅消息',
            items: [
              { key: '2_2_2_0', label: '每日推送' },
              { key: '2_2_2_1', label: '每周汇总' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: '3',
    label: '帮助中心',
    items: [
      { key: '3_0', label: '使用文档' },
      { key: '3_1', label: '常见问题' },
    ],
  },
]);
</script>
