<template>
  <xy-float-button @click="handleClick" />

  <xy-float-button
    shape="circle"
    type="primary"
    :style="{
      right: '94px',
    }"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
  </xy-float-button>

  <xy-float-button
    shape="square"
    type="primary"
    :style="{
      right: '24px',
    }"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
  </xy-float-button>
</template>

<script lang="ts" setup>
import { CustomerServiceOutlined } from '@xiaoye-ui/icons';
const handleClick = () => console.log('click');
</script>
