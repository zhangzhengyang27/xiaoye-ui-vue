<template>
  <xy-space :size="16" wrap>
    <xy-panel title="订单概览" style="width: 320px">
      <template #icons>
        <xy-tooltip title="刷新">
          <xy-button type="text" size="small" :icon="h(ReloadOutlined)" />
        </xy-tooltip>
        <xy-tooltip title="更多">
          <xy-button type="text" size="small" :icon="h(EllipsisOutlined)" />
        </xy-tooltip>
      </template>

      <xy-statistic title="本月订单数" :value="1280" />
      <xy-divider style="margin: 12px 0" />
      <xy-space>
        <xy-tag color="green">已完成 980</xy-tag>
        <xy-tag color="orange">处理中 200</xy-tag>
        <xy-tag color="red">已取消 100</xy-tag>
      </xy-space>
    </xy-panel>

    <xy-panel title="加载中状态" loading style="width: 320px">
      <p>这段内容不会显示，因为面板处于加载状态。</p>
    </xy-panel>
  </xy-space>
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { ReloadOutlined, EllipsisOutlined } from '@xiaoye-ui/icons';
</script>
