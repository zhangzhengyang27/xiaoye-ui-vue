<template>
  <xy-organization-chart :value="data">
    <template #default="{ node }">
      <div class="node">
        <xy-avatar :size="40" :src="node.data.avatar">{{ node.data.initial }}</xy-avatar>
        <div class="info">
          <div class="name">{{ node.data.name }}</div>
          <div class="title">{{ node.data.title }}</div>
        </div>
      </div>
    </template>
  </xy-organization-chart>
</template>

<script lang="ts" setup>
import type { OrganizationChartNode } from 'xiaoye-ui';

const data: OrganizationChartNode = {
  key: '0',
  data: {
    name: '张伟',
    title: '首席执行官',
    initial: '张',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Zhang',
  },
  children: [
    {
      key: '0-0',
      data: {
        name: '李娜',
        title: '技术总监',
        initial: '李',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Li',
      },
      children: [
        {
          key: '0-0-0',
          data: {
            name: '王强',
            title: '前端组长',
            initial: '王',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Wang',
          },
        },
        {
          key: '0-0-1',
          data: {
            name: '赵敏',
            title: '后端组长',
            initial: '赵',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Zhao',
          },
        },
      ],
    },
    {
      key: '0-1',
      data: {
        name: '陈晨',
        title: '市场总监',
        initial: '陈',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Chen',
      },
    },
  ],
};
</script>

<style scoped>
.node {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  min-width: 160px;
}
.info {
  text-align: left;
}
.name {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}
.title {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
