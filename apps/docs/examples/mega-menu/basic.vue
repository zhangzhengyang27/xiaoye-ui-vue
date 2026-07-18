<template>
  <!-- 基础用法：水平方向的多列菜单 -->
  <xy-mega-menu :model="model" @item-click="onItemClick" />
</template>
<script lang="ts" setup>
import type { MegaMenuItem } from 'xiaoye-ui';

// 菜单数据：每个顶级项可包含多列子菜单
const model: MegaMenuItem[] = [
  {
    key: 'videos',
    label: '视频',
    items: [
      [
        {
          label: '视频分类 1',
          items: [
            { key: 'v1-1', label: '视频 1.1' },
            { key: 'v1-2', label: '视频 1.2' },
          ],
        },
        {
          label: '视频分类 2',
          items: [
            { key: 'v2-1', label: '视频 2.1' },
            { key: 'v2-2', label: '视频 2.2' },
          ],
        },
      ],
    ],
  },
  {
    key: 'users',
    label: '用户',
    items: [
      [
        {
          label: '用户分组 1',
          items: [{ key: 'u1-1', label: '用户 1.1' }],
        },
      ],
      [
        {
          label: '用户分组 2',
          items: [{ key: 'u2-1', label: '用户 2.1' }],
        },
      ],
    ],
  },
  {
    key: 'settings',
    label: '设置',
  },
];

// 点击菜单项回调
function onItemClick(e: { key: string; item: any }) {
  // eslint-disable-next-line no-console
  console.info('itemClick', e.key, e.item);
}
</script>
