<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-space align="center">
      <xy-tag color="processing">已加载：{{ items.length }} / {{ TOTAL }} 条</xy-tag>
      <xy-tag :color="loading ? 'warning' : 'success'">
        {{ loading ? '加载中...' : '加载完成' }}
      </xy-tag>
    </xy-space>

    <xy-virtual-scroller
      :items="items"
      :item-size="48"
      scroll-height="320px"
      :lazy="true"
      :step="30"
      :show-loader="true"
      :loading="loading"
      style="border: 1px solid #f0f0f0; border-radius: 8px"
      @lazy-load="onLazyLoad"
    >
      <template #item="{ item, options }">
        <div class="list-item" :class="{ even: options.even }">
          <span class="item-id">#{{ String(item.id).padStart(5, '0') }}</span>
          <span class="item-text">{{ item.text }}</span>
          <xy-tag v-if="options.last" color="green">末项</xy-tag>
        </div>
      </template>
      <template #loader>
        <div class="custom-loader">
          <LoadingOutlined spin />
          <span>正在加载更多数据...</span>
        </div>
      </template>
    </xy-virtual-scroller>

    <xy-button v-if="items.length < TOTAL" type="primary" @click="loadMore">
      手动加载下一批（30 条）
    </xy-button>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { LoadingOutlined } from '@xiaoye-ui/icons';

interface DataItem {
  id: number;
  text: string;
}

const TOTAL = 1000;
const STEP = 30;

function generateBatch(start: number, count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    text: `这是第 ${start + i + 1} 条懒加载的数据项`,
  }));
}

const items = ref<DataItem[]>(generateBatch(0, STEP));
const loading = ref(false);

function onLazyLoad(_event: any) {
  if (loading.value) return;
  if (items.value.length >= TOTAL) return;

  loading.value = true;
  // 模拟异步请求
  setTimeout(() => {
    const next = generateBatch(items.value.length, STEP);
    items.value = [...items.value, ...next];
    loading.value = false;
  }, 600);
}

function loadMore() {
  onLazyLoad({});
}
</script>
<style scoped>
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid #f5f5f5;
  box-sizing: border-box;
}
.list-item.even {
  background: #fafbff;
}
.item-id {
  color: #1677ff;
  font-family: monospace;
  width: 80px;
}
.item-text {
  flex: 1;
}
.custom-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  color: #1677ff;
  background: #f0f5ff;
}
</style>
