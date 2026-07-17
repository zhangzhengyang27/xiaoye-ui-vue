<template>
  <xy-chart type="line" :data="data" :options="options" :height="240" />
</template>

<script lang="ts" setup>
const data = {
  labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
  datasets: [
    {
      label: '收入',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: '#1677ff',
      backgroundColor: 'rgba(22, 119, 255, 0.1)',
      fill: true,
      tension: 0.3,
    },
    {
      label: '支出',
      data: [8, 12, 10, 15, 14, 18],
      borderColor: '#ff4d4f',
      backgroundColor: 'rgba(255, 77, 79, 0.1)',
      fill: true,
      tension: 0.3,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>
