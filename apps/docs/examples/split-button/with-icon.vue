<template>
  <div class="demo-split-button-wrap">
    <xy-split-button
      label="上传"
      type="primary"
      :icon="h(UploadOutlined)"
      :model="model"
      @item-click="handleItemClick"
    />
    <xy-split-button
      label="下载"
      type="default"
      :icon="h(DownloadOutlined)"
      :model="model"
      @item-click="handleItemClick"
    />
    <xy-split-button type="primary" :icon="h(FileTextOutlined)" :model="model">
      文档管理
    </xy-split-button>
  </div>
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { UploadOutlined, DownloadOutlined, FileTextOutlined } from '@xiaoye-ui/icons';
import type { SplitButtonItem } from 'xiaoye-ui';

const model: SplitButtonItem[] = [
  { key: '1', label: '从本地' },
  { key: '2', label: '从云端' },
  { key: '3', label: '从链接', divided: true },
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
