<template>
  <xy-space :size="16" wrap>
    <xy-panel style="width: 360px">
      <template #header>
        <div class="title-with-tabs">
          <xy-tabs v-model:active-key="tab" size="small">
            <xy-tab-pane key="overview" tab="概览" />
            <xy-tab-pane key="detail" tab="详情" />
            <xy-tab-pane key="log" tab="日志" />
          </xy-tabs>
        </div>
      </template>

      <div v-if="tab === 'overview'">
        <p>当前显示「概览」内容。头部使用 tabs 替代普通标题。</p>
        <xy-statistic title="总销售额" :value="89200" prefix="￥" />
      </div>
      <div v-else-if="tab === 'detail'">
        <p>当前显示「详情」内容。</p>
        <xy-descriptions :column="1" size="small" bordered>
          <xy-descriptions-item label="订单号">XY-2026-0001</xy-descriptions-item>
          <xy-descriptions-item label="客户">张三</xy-descriptions-item>
          <xy-descriptions-item label="状态">
            <xy-tag color="success">已完成</xy-tag>
          </xy-descriptions-item>
        </xy-descriptions>
      </div>
      <div v-else>
        <p>当前显示「日志」内容。</p>
        <pre class="log-pre">
[INFO] 订单创建
[INFO] 支付成功
[INFO] 已发货
[INFO] 用户签收</pre>
      </div>

      <template #icons>
        <xy-button type="text" size="small" :icon="h(DownloadOutlined)" />
      </template>
    </xy-panel>

    <xy-panel style="width: 360px">
      <template #title>
        <span class="custom-title">
          <xy-tag color="blue" style="margin-right: 8px">NEW</xy-tag>
          通过 title 插槽自定义标题
        </span>
      </template>
      <p>
        使用
        <code>title</code>
        插槽可保留默认头部布局，仅自定义标题区域内容。
      </p>
      <p>适合在标题中加入徽标、标签等装饰元素。</p>
    </xy-panel>
  </xy-space>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { DownloadOutlined } from '@xiaoye-ui/icons';

const tab = ref('overview');
</script>
<style scoped>
.title-with-tabs {
  width: 100%;
}
.log-pre {
  background: #1f1f1f;
  color: #d3ad7c;
  padding: 12px;
  border-radius: 6px;
  margin: 0;
  font-family: monospace;
  white-space: pre-wrap;
}
.custom-title {
  display: inline-flex;
  align-items: center;
}
:deep(.xy-panel p) {
  margin: 4px 0;
}
</style>
