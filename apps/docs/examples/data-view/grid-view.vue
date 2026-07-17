<template>
  <xy-data-view :value="products" layout="grid">
    <template #grid="{ items }">
      <div class="grid">
        <div v-for="item in items" :key="item.id" class="card">
          <img :src="item.image" :alt="item.name" class="cover" />
          <div class="body">
            <div class="name">{{ item.name }}</div>
            <div class="tag">{{ item.tag }}</div>
            <div class="price">¥{{ item.price }}</div>
          </div>
        </div>
      </div>
    </template>
  </xy-data-view>
</template>

<script lang="ts" setup>
interface App {
  id: number;
  name: string;
  tag: string;
  price: number;
  image: string;
}

const products: App[] = [
  {
    id: 1,
    name: '任务管理 Pro',
    tag: '效率',
    price: 38,
    image: 'https://picsum.photos/seed/a1/200/200',
  },
  {
    id: 2,
    name: '笔记云同步',
    tag: '工具',
    price: 12,
    image: 'https://picsum.photos/seed/a2/200/200',
  },
  {
    id: 3,
    name: '设计素材库',
    tag: '设计',
    price: 68,
    image: 'https://picsum.photos/seed/a3/200/200',
  },
  {
    id: 4,
    name: '代码片段集',
    tag: '开发',
    price: 0,
    image: 'https://picsum.photos/seed/a4/200/200',
  },
  {
    id: 5,
    name: '数据看板',
    tag: '分析',
    price: 88,
    image: 'https://picsum.photos/seed/a5/200/200',
  },
  {
    id: 6,
    name: '流程图绘制',
    tag: '工具',
    price: 25,
    image: 'https://picsum.photos/seed/a6/200/200',
  },
];
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card {
  overflow: hidden;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fff;
}
.cover {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.body {
  padding: 12px;
}
.name {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}
.tag {
  display: inline-block;
  margin-top: 6px;
  padding: 1px 8px;
  font-size: 12px;
  color: #1677ff;
  background: #e6f4ff;
  border-radius: 4px;
}
.price {
  margin-top: 8px;
  color: #ff4d4f;
  font-weight: 600;
}
</style>
