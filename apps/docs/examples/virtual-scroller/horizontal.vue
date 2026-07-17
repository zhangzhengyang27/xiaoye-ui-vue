<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      message="设置 orientation 为 horizontal 实现水平虚拟滚动，适合横向时间轴、图片画廊等场景。"
    />
    <xy-virtual-scroller
      :items="cards"
      :item-size="200"
      orientation="horizontal"
      scroll-width="100%"
      style="height: 240px; border: 1px solid #f0f0f0; border-radius: 8px"
    >
      <template #item="{ item, options }">
        <div class="card" :style="{ background: item.color }">
          <div class="card-no">#{{ options.index + 1 }}</div>
          <div class="card-title">{{ item.title }}</div>
          <div class="card-desc">{{ item.desc }}</div>
        </div>
      </template>
    </xy-virtual-scroller>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

interface CardItem {
  id: number;
  title: string;
  desc: string;
  color: string;
}

const colors = [
  '#e6f4ff',
  '#f6ffed',
  '#fff7e6',
  '#fff0f6',
  '#f9f0ff',
  '#e6fffb',
  '#fcffe6',
  '#fffbe6',
];

const cards = ref<CardItem[]>(
  Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    title: `卡片 ${i + 1}`,
    desc: `这是第 ${i + 1} 张卡片`,
    color: colors[i % colors.length],
  })),
);
</script>
<style scoped>
.card {
  width: 200px;
  height: 200px;
  margin: 20px;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}
.card-no {
  font-size: 24px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.25);
}
.card-title {
  font-size: 16px;
  font-weight: 600;
}
.card-desc {
  font-size: 12px;
  color: #595959;
}
</style>
