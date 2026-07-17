<template>
  <xy-splitter layout="horizontal" style="height: 240px">
    <xy-splitter-panel :size="30">
      <div class="panel-content panel-left">
        <h4>左侧面板</h4>
        <p>初始占比 30%</p>
        <p>拖动中间分隔条调整两侧宽度。</p>
      </div>
    </xy-splitter-panel>
    <xy-splitter-panel :size="70">
      <div class="panel-content panel-right">
        <h4>右侧面板</h4>
        <p>初始占比 70%</p>
        <p>支持鼠标拖动和键盘方向键调整。</p>
      </div>
    </xy-splitter-panel>
  </xy-splitter>
</template>
<script lang="ts" setup></script>
<style scoped>
.panel-content {
  height: 100%;
  padding: 16px;
  overflow: auto;
}
.panel-content h4 {
  margin: 0 0 8px;
}
.panel-left {
  background: #f0f5ff;
  color: #1d39c4;
}
.panel-right {
  background: #f6ffed;
  color: #389e0d;
}
.panel-content p {
  margin: 4px 0;
}
</style>
