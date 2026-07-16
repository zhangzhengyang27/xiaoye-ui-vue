<template>
  <a-float-button
    shape="square"
    description="HELP INFO"
    :style="{
      right: '24px',
    }"
  >
    <template #icon>
      <FileTextOutlined />
    </template>
  </a-float-button>

  <a-float-button
    shape="square"
    description="HELP INFO"
    :style="{
      right: '94px',
    }"
  ></a-float-button>

  <a-float-button
    shape="square"
    description="HELP"
    :style="{
      right: '164px',
    }"
  >
    <template #icon>
      <FileTextOutlined />
    </template>
  </a-float-button>
</template>

<script lang="ts" setup>
import { FileTextOutlined } from '@ant-design/icons-vue';
</script>
