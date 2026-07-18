<template>
  <div class="demo-split-button-wrap">
    <xy-split-button
      label="大尺寸"
      type="primary"
      size="large"
      :model="model"
      @item-click="handleItemClick"
    />
    <xy-split-button
      label="中尺寸"
      type="primary"
      size="middle"
      :model="model"
      @item-click="handleItemClick"
    />
    <xy-split-button
      label="小尺寸"
      type="primary"
      size="small"
      :model="model"
      @item-click="handleItemClick"
    />
  </div>
</template>
<script lang="ts" setup>
import type { SplitButtonItem } from 'xiaoye-ui';

const model: SplitButtonItem[] = [
  { key: '1', label: '操作一' },
  { key: '2', label: '操作二' },
  { key: '3', label: '操作三' },
];

const handleItemClick = (_info: { key: string }) => {
  // 根据 key 执行对应操作
};
</script>
<style lang="less" scoped>
.demo-split-button-wrap .xy-split-button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
