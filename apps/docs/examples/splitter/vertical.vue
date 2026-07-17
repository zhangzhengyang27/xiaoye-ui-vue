<template>
  <xy-splitter layout="vertical" style="height: 320px">
    <xy-splitter-panel :size="40">
      <div class="panel-content panel-top">
        <h4>顶部面板</h4>
        <p>垂直布局：拖动水平分隔条调整上下高度。</p>
        <p>使用 ArrowUp / ArrowDown 可通过键盘调整。</p>
      </div>
    </xy-splitter-panel>
    <xy-splitter-panel :size="60">
      <div class="panel-content panel-bottom">
        <h4>底部面板</h4>
        <p>常用于上下分栏的内容布局、终端窗口等场景。</p>
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
.panel-content p {
  margin: 4px 0;
}
.panel-top {
  background: #fff7e6;
  color: #ad6800;
}
.panel-bottom {
  background: #fff0f6;
  color: #9e1068;
}
</style>
