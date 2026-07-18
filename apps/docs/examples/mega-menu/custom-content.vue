<template>
  <!-- 自定义面板内容：通过 start / end 插槽定制菜单两侧内容 -->
  <xy-mega-menu v-model:active-item="activeKey" :model="model">
    <template #start>
      <span style="font-weight: 600; padding: 0 8px; color: #1677ff">XiaoyeUI</span>
    </template>
    <template #end>
      <xy-button type="primary" size="small">登录</xy-button>
    </template>
  </xy-mega-menu>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { MegaMenuItem } from 'xiaoye-ui';

const activeKey = ref<string>('');

const model: MegaMenuItem[] = [
  {
    key: 'docs',
    label: '文档',
    items: [
      [
        {
          label: '指南',
          items: [
            { key: 'd-1', label: '介绍' },
            { key: 'd-2', label: '安装' },
          ],
        },
      ],
      [
        {
          label: '组件',
          items: [
            { key: 'd-3', label: '通用' },
            { key: 'd-4', label: '布局' },
          ],
        },
      ],
    ],
  },
  {
    key: 'community',
    label: '社区',
    items: [
      [
        {
          label: '资源',
          items: [{ key: 'c-1', label: '主题市场' }],
        },
      ],
    ],
  },
  {
    key: 'about',
    label: '关于',
  },
];
</script>
