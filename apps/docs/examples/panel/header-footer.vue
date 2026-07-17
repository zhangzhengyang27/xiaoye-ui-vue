<template>
  <xy-panel style="width: 380px">
    <template #header>
      <div class="custom-header">
        <xy-avatar style="background-color: #1677ff">XY</xy-avatar>
        <div class="header-info">
          <div class="header-title">自定义头部</div>
          <div class="header-desc">通过 header 插槽渲染</div>
        </div>
      </div>
    </template>

    <template #icons>
      <xy-tooltip title="编辑">
        <xy-button type="text" size="small" :icon="h(EditOutlined)" />
      </xy-tooltip>
      <xy-tooltip title="分享">
        <xy-button type="text" size="small" :icon="h(ShareAltOutlined)" />
      </xy-tooltip>
    </template>

    <p>
      面板支持通过
      <code>header</code>
      插槽完全自定义头部内容。
    </p>
    <p>
      头部右侧区域可通过
      <code>icons</code>
      插槽放置操作按钮。
    </p>
    <p>正文区域展示主要内容。</p>

    <template #footer>
      <div class="custom-footer">
        <xy-space>
          <xy-button size="small">取消</xy-button>
          <xy-button type="primary" size="small">确定</xy-button>
        </xy-space>
      </div>
    </template>
  </xy-panel>
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { EditOutlined, ShareAltOutlined } from '@xiaoye-ui/icons';
</script>
<style scoped>
.custom-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-info {
  display: flex;
  flex-direction: column;
}
.header-title {
  font-weight: 500;
}
.header-desc {
  font-size: 12px;
  color: #888;
}
.custom-footer {
  display: flex;
  justify-content: flex-end;
}
:deep(.xy-panel p) {
  margin: 4px 0;
}
</style>
