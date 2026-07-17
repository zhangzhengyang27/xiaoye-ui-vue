<template>
  <xy-data-view v-model:rows="rows" :value="products" :layout="layout">
    <template #header>
      <div class="header">
        <xy-segmented v-model:value="layout" :options="layoutOptions" />
      </div>
    </template>
    <template #list="{ items }">
      <div class="list">
        <div v-for="item in items" :key="item.id" class="list-item">
          <img :src="item.image" :alt="item.name" class="thumb" />
          <div class="info">
            <div class="name">{{ item.name }}</div>
            <div class="desc">{{ item.category }}</div>
          </div>
          <div class="price">¥{{ item.price }}</div>
        </div>
      </div>
    </template>
    <template #grid="{ items }">
      <div class="grid">
        <div v-for="item in items" :key="item.id" class="grid-item">
          <img :src="item.image" :alt="item.name" class="cover" />
          <div class="name">{{ item.name }}</div>
          <div class="price">¥{{ item.price }}</div>
        </div>
      </div>
    </template>
  </xy-data-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

const layout = ref<'list' | 'grid'>('list');
const rows = ref(4);
const layoutOptions = [
  { label: '列表', value: 'list' },
  { label: '网格', value: 'grid' },
];

const products: Product[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `商品 ${i + 1}`,
  category: ['数码', '服饰', '家居', '食品'][i % 4],
  price: Math.round((Math.random() * 900 + 100) * 100) / 100,
  image: `https://picsum.photos/seed/p${i + 1}/120/120`,
}));
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}
.thumb {
  width: 56px;
  height: 56px;
  border-radius: 6px;
  object-fit: cover;
}
.info {
  flex: 1;
}
.name {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
}
.desc {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.price {
  color: #ff4d4f;
  font-weight: 600;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.grid-item {
  padding: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  text-align: center;
}
.cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  object-fit: cover;
}
.grid-item .name {
  margin-top: 8px;
}
.grid-item .price {
  margin-top: 4px;
}
</style>
