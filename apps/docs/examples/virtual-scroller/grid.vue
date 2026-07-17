<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      message="通过 item 插槽可自定义每一行的渲染内容，下方演示一个等高行 + 自定义列的表格样式虚拟列表。"
    />

    <xy-virtual-scroller
      :items="rows"
      :item-size="56"
      scroll-height="320px"
      style="border: 1px solid #f0f0f0; border-radius: 8px"
    >
      <template #item="{ item, options }">
        <div class="table-row" :class="{ even: options.even }" @click="onRowClick(item)">
          <div class="cell cell-id">{{ item.id }}</div>
          <div class="cell cell-name">
            <xy-avatar size="small" :style="{ background: item.color }">
              {{ item.name.charAt(0) }}
            </xy-avatar>
            <span>{{ item.name }}</span>
          </div>
          <div class="cell cell-status">
            <xy-tag :color="statusColor(item.status)">{{ item.status }}</xy-tag>
          </div>
          <div class="cell cell-amount">{{ item.amount }}</div>
          <div class="cell cell-date">{{ item.date }}</div>
        </div>
      </template>
    </xy-virtual-scroller>

    <xy-space>
      <xy-button @click="prependRow">头部插入一行</xy-button>
      <xy-button danger @click="removeLast">删除末行</xy-button>
      <xy-tag color="blue">当前行数：{{ rows.length }}</xy-tag>
    </xy-space>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

interface RowItem {
  id: number;
  name: string;
  status: string;
  amount: string;
  date: string;
  color: string;
}

const names = ['赵雷', '钱多', '孙莉', '周一', '吴用', '郑爽', '王红', '李四'];
const statuses = ['待支付', '已支付', '已发货', '已完成', '已取消'];
const colors = ['#1677ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2'];

function createRow(id: number): RowItem {
  return {
    id,
    name: names[id % names.length],
    status: statuses[id % statuses.length],
    amount: `￥${(Math.random() * 1000 + 100).toFixed(2)}`,
    date: `2026-07-${String((id % 28) + 1).padStart(2, '0')}`,
    color: colors[id % colors.length],
  };
}

const rows = ref<RowItem[]>(Array.from({ length: 2000 }, (_, i) => createRow(i + 1)));

function statusColor(status: string) {
  return {
    待支付: 'orange',
    已支付: 'blue',
    已发货: 'processing',
    已完成: 'success',
    已取消: 'error',
  }[status] as any;
}

function onRowClick(row: RowItem) {
  message.info(`点击了第 ${row.id} 行：${row.name}`);
}

function prependRow() {
  const newId = (rows.value[0]?.id ?? 0) - 1;
  rows.value = [createRow(newId), ...rows.value];
}

function removeLast() {
  if (rows.value.length > 0) {
    rows.value = rows.value.slice(0, -1);
  }
}
</script>
<style scoped>
.table-row {
  display: grid;
  grid-template-columns: 60px 1.5fr 1fr 1fr 1fr;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid #f5f5f5;
  box-sizing: border-box;
  cursor: pointer;
  transition: background 0.2s;
}
.table-row:hover {
  background: #f5faff;
}
.table-row.even {
  background: #fafbff;
}
.table-row.even:hover {
  background: #f5faff;
}
.cell {
  padding: 0 4px;
}
.cell-id {
  color: #1677ff;
  font-family: monospace;
}
.cell-name {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
