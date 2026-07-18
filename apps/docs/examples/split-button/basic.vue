<template>
  <div class="demo-split-button-wrap">
    <xy-split-button
      label="保存"
      :model="model"
      @click="handleClick"
      @item-click="handleItemClick"
    />
  </div>
</template>
<script lang="ts" setup>
import type { SplitButtonItem } from 'xiaoye-ui';

const model: SplitButtonItem[] = [
  { key: '1', label: '导出 PDF' },
  { key: '2', label: '导出 Word' },
  { key: '3', label: '打印', divided: true },
];

const handleClick = () => {
  // 主按钮点击：执行保存操作
};

const handleItemClick = (_info: { key: string }) => {
  // 菜单项点击：根据 key 执行对应操作
};
</script>
<style lang="less" scoped>
.demo-split-button-wrap .xy-split-button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
