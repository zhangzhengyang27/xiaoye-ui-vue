<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      message="共渲染 10000 条数据，但 DOM 中只保留视口可见的若干项。通过 item 插槽的 options 可获取 index、count、first、last 等信息。"
    />
    <xy-virtual-scroller
      :items="items"
      :item-size="44"
      scroll-height="280px"
      style="border: 1px solid #f0f0f0; border-radius: 8px"
    >
      <template #item="{ item, options }">
        <div
          class="list-item"
          :class="{ even: options.even, first: options.first, last: options.last }"
        >
          <xy-avatar :style="{ background: avatarColor(item.id) }" size="small">
            {{ item.name.charAt(0) }}
          </xy-avatar>
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-email">{{ item.email }}</div>
          </div>
          <xy-tag :color="options.even ? 'blue' : 'default'">#{{ options.index + 1 }}</xy-tag>
        </div>
      </template>
    </xy-virtual-scroller>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

interface UserItem {
  id: number;
  name: string;
  email: string;
}

const firstNames = ['张', '李', '王', '赵', '钱', '孙', '周', '吴', '郑', '陈'];
const lastNames = ['伟', '芳', '娜', '敏', '静', '强', '磊', '军', '洋', '勇'];

function generateItems(count: number): UserItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: firstNames[i % firstNames.length] + lastNames[(i * 3) % lastNames.length],
    email: `user${i + 1}@example.com`,
  }));
}

const items = ref<UserItem[]>(generateItems(10000));

function avatarColor(id: number) {
  const colors = ['#1677ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2'];
  return colors[id % colors.length];
}
</script>
<style scoped>
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid #f5f5f5;
  box-sizing: border-box;
}
.list-item.even {
  background: #fafbff;
}
.list-item.first {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.item-name {
  font-weight: 500;
}
.item-email {
  font-size: 12px;
  color: #888;
}
</style>
