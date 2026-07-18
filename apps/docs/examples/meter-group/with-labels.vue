<template>
  <!-- 带标签：通过 labelPosition / labelOrientation 控制标签位置与方向 -->
  <div style="display: flex; flex-direction: column; gap: 24px">
    <div>
      <p>标签在底部（默认）</p>
      <xy-meter-group :values="values" label-position="end" label-orientation="horizontal" />
    </div>
    <div>
      <p>标签在顶部</p>
      <xy-meter-group :values="values" label-position="start" label-orientation="horizontal" />
    </div>
    <div>
      <p>标签纵向排列</p>
      <xy-meter-group :values="values" label-position="end" label-orientation="vertical" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const values = ref([
  { label: '已完成', value: 50, color: '#1677ff' },
  { label: '进行中', value: 30, color: '#13c2c2' },
  { label: '待开始', value: 15, color: '#bfbfbf' },
]);
</script>
