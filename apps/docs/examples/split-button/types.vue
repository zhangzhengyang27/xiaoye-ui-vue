<template>
  <div class="demo-split-button-wrap">
    <xy-split-button label="Default" type="default" :model="model" @item-click="handleItemClick" />
    <xy-split-button label="Primary" type="primary" :model="model" @item-click="handleItemClick" />
    <xy-split-button label="Dashed" type="dashed" :model="model" @item-click="handleItemClick" />
    <xy-split-button label="Ghost" type="ghost" :model="model" @item-click="handleItemClick" />
    <xy-split-button label="Text" type="text" :model="model" @item-click="handleItemClick" />
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
