<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-space wrap align="center">
      <xy-input-number
        v-model:value="targetIndex"
        :min="0"
        :max="items.length - 1"
        :step="10"
        style="width: 140px"
      />
      <xy-button type="primary" @click="scrollTo(targetIndex, 'auto')">
        跳转到该项（无动画）
      </xy-button>
      <xy-button @click="scrollTo(targetIndex, 'smooth')">平滑跳转</xy-button>
      <xy-button @click="scrollToTop">回到顶部</xy-button>
      <xy-button @click="scrollToBottom">跳到底部</xy-button>
    </xy-space>

    <xy-alert
      type="info"
      show-icon
      :message="`当前可见范围：第 ${range.first + 1} 项 ~ 第 ${range.last + 1} 项 / 共 ${items.length} 项`"
    />

    <xy-virtual-scroller
      ref="scrollerRef"
      :items="items"
      :item-size="40"
      scroll-height="300px"
      :delay="80"
      style="border: 1px solid #f0f0f0; border-radius: 8px"
      @scroll-index-change="onRangeChange"
    >
      <template #item="{ item, options }">
        <div class="list-item" :class="{ highlight: options.index === targetIndex }">
          <span class="item-id">{{ String(item.id).padStart(4, '0') }}</span>
          <span class="item-text">{{ item.text }}</span>
          <span class="item-meta">{{ options.index + 1 }} / {{ options.count }}</span>
        </div>
      </template>
    </xy-virtual-scroller>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref, shallowRef } from 'vue';

interface DataItem {
  id: number;
  text: string;
}

const items = ref<DataItem[]>(
  Array.from({ length: 5000 }, (_, i) => ({
    id: i + 1,
    text: `数据项 ${i + 1}`,
  })),
);

const scrollerRef = shallowRef<any>(null);
const targetIndex = ref(100);
const range = ref({ first: 0, last: 0 });

function scrollTo(index: number, behavior: 'auto' | 'smooth' = 'auto') {
  scrollerRef.value?.scrollToIndex(index, behavior);
}

function scrollToTop() {
  scrollerRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
  const last = items.value.length - 1;
  scrollerRef.value?.scrollToIndex(last, 'smooth');
}

function onRangeChange(state: any) {
  range.value = { first: state.first, last: state.last };
}
</script>
<style scoped>
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid #f5f5f5;
  box-sizing: border-box;
  transition: background 0.2s;
}
.list-item.highlight {
  background: #fff7e6;
  border-left: 3px solid #faad14;
}
.item-id {
  color: #1677ff;
  font-family: monospace;
  width: 60px;
}
.item-text {
  flex: 1;
}
.item-meta {
  font-size: 12px;
  color: #999;
}
</style>
