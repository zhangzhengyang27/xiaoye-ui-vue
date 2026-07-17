<template>
  <xy-chart type="polarArea" :data="data" :options="options" :height="260" />
</template>

<script lang="ts" setup>
const data = {
  labels: ['跑步', '游泳', '骑行', '瑜伽', '力量训练'],
  datasets: [
    {
      data: [11, 16, 7, 14, 9],
      backgroundColor: [
        'rgba(22, 119, 255, 0.6)',
        'rgba(82, 196, 26, 0.6)',
        'rgba(250, 173, 20, 0.6)',
        'rgba(255, 77, 79, 0.6)',
        'rgba(114, 46, 209, 0.6)',
      ],
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
  scales: {
    r: {
      beginAtZero: true,
    },
  },
};
</script>
