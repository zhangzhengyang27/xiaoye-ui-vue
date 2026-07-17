<template>
  <xy-chart type="radar" :data="data" :options="options" :height="260" />
</template>

<script lang="ts" setup>
const data = {
  labels: ['销售', '技术', '市场', '运营', '客服', '管理'],
  datasets: [
    {
      label: '张三',
      data: [80, 90, 70, 65, 75, 85],
      borderColor: '#1677ff',
      backgroundColor: 'rgba(22, 119, 255, 0.2)',
      pointBackgroundColor: '#1677ff',
    },
    {
      label: '李四',
      data: [70, 75, 90, 80, 70, 60],
      borderColor: '#52c41a',
      backgroundColor: 'rgba(82, 196, 26, 0.2)',
      pointBackgroundColor: '#52c41a',
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
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20,
      },
    },
  },
};
</script>
