<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      message="设置 stateKey 后，面板尺寸会自动持久化到 sessionStorage。调整尺寸后刷新页面，可恢复上次尺寸。点击按钮可清除保存的状态。"
    />
    <xy-space>
      <xy-button @click="reload">刷新页面</xy-button>
      <xy-button danger @click="clearState">清除持久化状态</xy-button>
    </xy-space>
    <xy-splitter
      layout="horizontal"
      style="height: 240px"
      state-key="demo-splitter-stateful"
      state-storage="session"
    >
      <xy-splitter-panel :size="30">
        <div class="panel-content panel-left">
          <h4>左侧面板</h4>
          <p>初始 size: 30</p>
          <p>调整后刷新会恢复。</p>
        </div>
      </xy-splitter-panel>
      <xy-splitter-panel :size="70">
        <div class="panel-content panel-right">
          <h4>右侧面板</h4>
          <p>初始 size: 70</p>
          <p>状态保存在 sessionStorage。</p>
        </div>
      </xy-splitter-panel>
    </xy-splitter>
  </xy-space>
</template>
<script lang="ts" setup>
import { message } from 'xiaoye-ui';

function reload() {
  location.reload();
}

function clearState() {
  sessionStorage.removeItem('demo-splitter-stateful');
  message.success('已清除持久化状态，刷新后将使用初始尺寸');
}
</script>
<style scoped>
.panel-content {
  height: 100%;
  padding: 16px;
  overflow: auto;
}
.panel-content h4 {
  margin: 0 0 8px;
}
.panel-content p {
  margin: 4px 0;
}
.panel-left {
  background: #f0f5ff;
  color: #1d39c4;
}
.panel-right {
  background: #f6ffed;
  color: #389e0d;
}
</style>
