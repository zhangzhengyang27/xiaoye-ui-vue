<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert type="info" show-icon message="通过 #item 插槽自定义列表项内容" />
    <xy-sortable-list :model="items" @update="onUpdate">
      <template #item="{ item, index }">
        <div class="custom-item">
          <xy-tag :color="item.color">{{ item.tag }}</xy-tag>
          <span class="custom-item-title">{{ index + 1 }}. {{ item.title }}</span>
          <span class="custom-item-desc">{{ item.desc }}</span>
        </div>
      </template>
    </xy-sortable-list>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

interface CardItem {
  key: string;
  label: string;
  tag: string;
  color: string;
  title: string;
  desc: string;
}

const items = ref<CardItem[]>([
  { key: '1', label: '卡片 1', tag: '重要', color: 'red', title: '首页改版', desc: 'Q3 重点项目' },
  {
    key: '2',
    label: '卡片 2',
    tag: '进行中',
    color: 'blue',
    title: '支付重构',
    desc: '替换底层 SDK',
  },
  {
    key: '3',
    label: '卡片 3',
    tag: '待启动',
    color: 'default',
    title: '性能优化',
    desc: '首屏提速',
  },
]);

function onUpdate(e: any) {
  items.value = e.value;
}
</script>
<style scoped>
.custom-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.custom-item-title {
  font-weight: 500;
  flex: 1 1 auto;
}
.custom-item-desc {
  color: #999;
  font-size: 12px;
  flex: 0 0 auto;
}
</style>
