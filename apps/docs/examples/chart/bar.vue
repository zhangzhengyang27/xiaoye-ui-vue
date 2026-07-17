<template>
  <xy-chart type="bar" :data="data" :options="options" :height="240" />
</template>

<script lang="ts" setup>
const data = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: '产品 A',
      data: [120, 180, 150, 200],
      backgroundColor: 'rgba(22, 119, 255, 0.7)',
      borderColor: '#1677ff',
      borderWidth: 1,
    },
    {
      label: '产品 B',
      data: [90, 140, 110, 170],
      backgroundColor: 'rgba(82, 196, 26, 0.7)',
      borderColor: '#52c41a',
      borderWidth: 1,
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
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>
