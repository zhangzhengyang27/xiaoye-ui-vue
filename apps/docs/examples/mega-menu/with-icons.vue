<template>
  <!-- 带图标：从 @xiaoye-ui/icons 导入图标，作为渲染函数传入 -->
  <xy-mega-menu :model="model" @item-click="onItemClick" />
</template>
<script lang="ts" setup>
import { h } from 'vue';
import {
  HomeIcon,
  BellIcon,
  MailIcon,
  BoxIcon,
  FileIcon,
  ImageIcon,
  DatabaseIcon,
} from '@xiaoye-ui/icons';
import type { MegaMenuItem } from 'xiaoye-ui';

const model: MegaMenuItem[] = [
  {
    key: 'home',
    label: '首页',
    icon: () => h(HomeIcon),
  },
  {
    key: 'notify',
    label: '通知',
    icon: () => h(BellIcon),
    items: [
      [
        {
          label: '消息通知',
          items: [
            { key: 'n-1', label: '系统消息' },
            { key: 'n-2', label: '互动消息' },
          ],
        },
      ],
    ],
  },
  {
    key: 'mail',
    label: '邮件',
    icon: () => h(MailIcon),
    items: [
      [
        {
          label: '收件箱',
          items: [{ key: 'inbox', label: '收件箱' }],
        },
      ],
      [
        {
          label: '已发送',
          items: [{ key: 'sent', label: '已发送' }],
        },
      ],
    ],
  },
  {
    key: 'files',
    label: '资源',
    icon: () => h(BoxIcon),
    items: [
      [
        {
          label: '文档',
          items: [{ key: 'doc', label: '文档', icon: () => h(FileIcon) }],
        },
      ],
      [
        {
          label: '图片',
          items: [{ key: 'img', label: '图片', icon: () => h(ImageIcon) }],
        },
      ],
      [
        {
          label: '数据',
          items: [{ key: 'db', label: '数据库', icon: () => h(DatabaseIcon) }],
        },
      ],
    ],
  },
];

function onItemClick(e: { key: string }) {
  // eslint-disable-next-line no-console
  console.info('click', e.key);
}
</script>
