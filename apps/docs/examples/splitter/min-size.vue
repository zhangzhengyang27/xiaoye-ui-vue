<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      message="左侧面板最小占比 20%，右侧面板最小占比 30%。拖动分隔条达到最小值时会被限制，不会无限压缩。"
    />
    <xy-splitter layout="horizontal" style="height: 240px">
      <xy-splitter-panel :size="50" :min-size="20">
        <div class="panel-content panel-left">
          <h4>左侧面板</h4>
          <p>size: 50</p>
          <p>minSize: 20</p>
          <p>尝试将分隔条拖到最左，会被限制在 20% 处。</p>
        </div>
      </xy-splitter-panel>
      <xy-splitter-panel :size="50" :min-size="30">
        <div class="panel-content panel-right">
          <h4>右侧面板</h4>
          <p>size: 50</p>
          <p>minSize: 30</p>
          <p>尝试将分隔条拖到最右，会被限制在 30% 处。</p>
        </div>
      </xy-splitter-panel>
    </xy-splitter>
  </xy-space>
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
.panel-left {
  background: #f0f5ff;
  color: #1d39c4;
}
.panel-right {
  background: #f6ffed;
  color: #389e0d;
}
</style>
