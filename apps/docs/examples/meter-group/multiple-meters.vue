<template>
  <!-- 多指标：在同一条进度条中展示更多维度，并自定义数值范围 -->
  <xy-meter-group :values="values" :min="0" :max="250" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 当指标总值超出 100 时，通过 min/max 调整刻度
const values = ref([
  { label: '研发', value: 80, color: '#1677ff' },
  { label: '设计', value: 50, color: '#52c41a' },
  { label: '测试', value: 60, color: '#faad14' },
  { label: '运维', value: 30, color: '#eb2f96' },
  { label: '其他', value: 30, color: '#8c8c8c' },
]);
</script>
