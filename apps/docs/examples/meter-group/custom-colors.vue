<template>
  <!-- 自定义颜色：为每个指标指定 color，标签区会同步颜色标记 -->
  <xy-meter-group :values="values" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const values = ref([
  { label: '直接访问', value: 35, color: '#5B8FF9' },
  { label: '搜索引擎', value: 28, color: '#5AD8A6' },
  { label: '邮件营销', value: 18, color: '#F6BD16' },
  { label: '联盟广告', value: 12, color: '#E86452' },
]);
</script>
