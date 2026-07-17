<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      :message="`当前各面板占比：${sizes.map(s => s.toFixed(1) + '%').join(' / ')}`"
    />
    <xy-splitter
      layout="horizontal"
      style="height: 240px"
      @resize="onResize"
      @resize-start="onResizeStart"
      @resize-end="onResizeEnd"
    >
      <xy-splitter-panel :size="40">
        <div class="panel-content panel-left">
          <h4>面板 A</h4>
          <p>当前占比：{{ (sizes[0] ?? 40).toFixed(1) }}%</p>
        </div>
      </xy-splitter-panel>
      <xy-splitter-panel :size="35">
        <div class="panel-content panel-center">
          <h4>面板 B</h4>
          <p>当前占比：{{ (sizes[1] ?? 35).toFixed(1) }}%</p>
        </div>
      </xy-splitter-panel>
      <xy-splitter-panel :size="25">
        <div class="panel-content panel-right">
          <h4>面板 C</h4>
          <p>当前占比：{{ (sizes[2] ?? 25).toFixed(1) }}%</p>
        </div>
      </xy-splitter-panel>
    </xy-splitter>
    <xy-space>
      <xy-tag :color="dragging ? 'processing' : 'default'">
        {{ dragging ? '拖动中...' : '空闲' }}
      </xy-tag>
      <xy-tag color="success">resize 事件触发次数：{{ count }}</xy-tag>
    </xy-space>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const sizes = ref<number[]>([40, 35, 25]);
const dragging = ref(false);
const count = ref(0);

function onResize(event: any) {
  if (Array.isArray(event?.sizes)) {
    sizes.value = event.sizes;
    count.value++;
  }
}

function onResizeStart(event: any) {
  dragging.value = true;
  if (Array.isArray(event?.sizes)) sizes.value = event.sizes;
}

function onResizeEnd(event: any) {
  dragging.value = false;
  if (Array.isArray(event?.sizes)) sizes.value = event.sizes;
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
.panel-center {
  background: #fff7e6;
  color: #ad6800;
}
.panel-right {
  background: #f6ffed;
  color: #389e0d;
}
</style>
