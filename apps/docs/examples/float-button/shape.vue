<template>
  <a-float-button @click="handleClick" />

  <a-float-button
    shape="circle"
    type="primary"
    :style="{
      right: '94px',
    }"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
  </a-float-button>

  <a-float-button
    shape="square"
    type="primary"
    :style="{
      right: '24px',
    }"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
  </a-float-button>
</template>

<script lang="ts" setup>
import { CustomerServiceOutlined } from '@xiaoye-ui/icons';
const handleClick = () => console.log('click');
</script>
