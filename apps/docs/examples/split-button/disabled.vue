<template>
  <div class="demo-split-button-wrap">
    <xy-split-button label="启用" type="primary" :model="model" @item-click="handleItemClick" />
    <xy-split-button
      label="禁用"
      type="primary"
      disabled
      :model="model"
      @item-click="handleItemClick"
    />
    <xy-split-button label="危险禁用" type="primary" danger disabled :model="model" />
  </div>
</template>
<script lang="ts" setup>
import type { SplitButtonItem } from 'xiaoye-ui';

const model: SplitButtonItem[] = [
  { key: '1', label: '操作一' },
  { key: '2', label: '操作二', disabled: true },
  { key: '3', label: '危险操作', danger: true, divided: true },
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
