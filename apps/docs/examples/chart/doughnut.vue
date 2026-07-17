<template>
  <xy-chart type="doughnut" :data="data" :options="options" :height="240" />
</template>

<script lang="ts" setup>
const data = {
  labels: ['已完成', '进行中', '待开始', '已延期'],
  datasets: [
    {
      data: [45, 30, 15, 10],
      backgroundColor: ['#52c41a', '#1677ff', '#faad14', '#ff4d4f'],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '55%',
  plugins: {
    legend: {
      position: 'right' as const,
    },
  },
};
</script>
