<template>
  <xy-chart type="pie" :data="data" :options="options" :height="240" />
</template>

<script lang="ts" setup>
const data = {
  labels: ['搜索引擎', '直接访问', '社交媒体', '广告投放', '其他'],
  datasets: [
    {
      data: [42, 23, 18, 12, 5],
      backgroundColor: ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#8c8c8c'],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
  },
};
</script>
