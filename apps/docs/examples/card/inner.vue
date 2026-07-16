<template>
  <a-card title="Card title">
    <p style="font-size: 14px; color: rgba(0, 0, 0, 0.85); margin-bottom: 16px; font-weight: 500">
      Group title
    </p>
    <a-card title="Inner card title">
      <template #extra>
        <a href="#">More</a>
      </template>
      Inner Card content
    </a-card>
    <a-card title="Inner card title" :style="{ marginTop: '16px' }">
      <template #extra>
        <a href="#">More</a>
      </template>
      Inner Card content
    </a-card>
  </a-card>
</template>
