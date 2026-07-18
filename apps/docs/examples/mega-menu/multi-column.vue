<template>
  <!-- 多列子菜单：items 为二维数组，支持 2/3/4/6 列栅格 -->
  <xy-mega-menu :model="model" />
</template>
<script lang="ts" setup>
import type { MegaMenuItem } from 'xiaoye-ui';

// 4 列布局示例
const model: MegaMenuItem[] = [
  {
    key: 'products',
    label: '产品分类',
    items: [
      [
        {
          label: '电子产品',
          items: [
            { key: 'p-1', label: '手机' },
            { key: 'p-2', label: '电脑' },
            { key: 'p-3', label: '平板' },
          ],
        },
      ],
      [
        {
          label: '家居生活',
          items: [
            { key: 'h-1', label: '家具' },
            { key: 'h-2', label: '家电' },
            { key: 'h-3', label: '厨具' },
          ],
        },
      ],
      [
        {
          label: '服饰鞋包',
          items: [
            { key: 'c-1', label: '男装' },
            { key: 'c-2', label: '女装' },
            { key: 'c-3', label: '鞋包' },
          ],
        },
      ],
      [
        {
          label: '美妆个护',
          items: [
            { key: 'b-1', label: '护肤' },
            { key: 'b-2', label: '彩妆' },
            { key: 'b-3', label: '香水' },
          ],
        },
      ],
    ],
  },
  {
    key: 'services',
    label: '服务支持',
    items: [
      [
        {
          label: '售前咨询',
          items: [{ key: 's-1', label: '在线咨询' }],
        },
        {
          label: '售后服务',
          items: [{ key: 's-2', label: '退换货' }],
        },
      ],
      [
        {
          label: '帮助文档',
          items: [{ key: 's-3', label: '使用教程' }],
        },
      ],
    ],
  },
];
</script>
