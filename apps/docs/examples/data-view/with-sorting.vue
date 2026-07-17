<template>
  <xy-data-view :value="products" layout="list" :sort-field="sortField" :sort-order="sortOrder">
    <template #header>
      <div class="toolbar">
        <span class="label">排序：</span>
        <xy-radio-group v-model:value="sortField" button-style="solid">
          <xy-radio-button value="name">名称</xy-radio-button>
          <xy-radio-button value="price">价格</xy-radio-button>
          <xy-radio-button value="sales">销量</xy-radio-button>
        </xy-radio-group>
        <xy-button @click="toggleOrder">
          {{ sortOrder === 1 ? '升序' : '降序' }}
        </xy-button>
      </div>
    </template>
    <template #list="{ items }">
      <div class="list">
        <div v-for="item in items" :key="item.id" class="row">
          <div class="name">{{ item.name }}</div>
          <div class="price">¥{{ item.price }}</div>
          <div class="sales">销量 {{ item.sales }}</div>
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
  price: number;
  sales: number;
}

const sortField = ref<keyof Product>('price');
const sortOrder = ref<1 | -1>(1);

function toggleOrder() {
  sortOrder.value = sortOrder.value === 1 ? -1 : 1;
}

const products: Product[] = [
  { id: 1, name: '无线鼠标', price: 89, sales: 320 },
  { id: 2, name: '机械键盘', price: 399, sales: 150 },
  { id: 3, name: 'USB-C 拓展坞', price: 159, sales: 540 },
  { id: 4, name: '显示器挂灯', price: 229, sales: 88 },
  { id: 5, name: '笔记本支架', price: 119, sales: 412 },
];
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.label {
  color: rgba(0, 0, 0, 0.65);
}
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}
.name {
  flex: 1;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
}
.price {
  color: #ff4d4f;
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}
.sales {
  min-width: 80px;
  text-align: right;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
