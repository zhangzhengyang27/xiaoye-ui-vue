<template>
  <xy-data-view
    v-model:rows="rows"
    v-model:first="first"
    :value="records"
    layout="grid"
    pagination
    :rows-per-page-options="[6, 12, 18]"
  >
    <template #grid="{ items }">
      <div class="grid">
        <div v-for="item in items" :key="item.id" class="card">
          <div class="cover">{{ item.id }}</div>
          <div class="name">{{ item.title }}</div>
        </div>
      </div>
    </template>
  </xy-data-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Record {
  id: number;
  title: string;
}

const rows = ref(6);
const first = ref(0);

const records: Record[] = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  title: `数据条目 ${String(i + 1).padStart(2, '0')}`,
}));
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}
.cover {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #1677ff, #69b1ff);
}
.name {
  padding: 8px;
  text-align: center;
  color: rgba(0, 0, 0, 0.88);
}
</style>
