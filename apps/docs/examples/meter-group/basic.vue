<template>
  <!-- 基础用法：通过 values 传入多个指标，自动并列展示 -->
  <xy-meter-group :values="values" :min="0" :max="100" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 指标数组：每项含 label、value、color
const values = ref([
  { label: '已使用', value: 60, color: '#1677ff' },
  { label: '已缓存', value: 20, color: '#52c41a' },
  { label: '可回收', value: 10, color: '#faad14' },
]);
</script>
