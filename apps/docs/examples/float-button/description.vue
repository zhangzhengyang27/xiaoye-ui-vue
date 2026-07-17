<template>
  <xy-float-button
    shape="square"
    description="HELP INFO"
    :style="{
      right: '24px',
    }"
  >
    <template #icon>
      <FileTextOutlined />
    </template>
  </xy-float-button>

  <xy-float-button
    shape="square"
    description="HELP INFO"
    :style="{
      right: '94px',
    }"
  ></xy-float-button>

  <xy-float-button
    shape="square"
    description="HELP"
    :style="{
      right: '164px',
    }"
  >
    <template #icon>
      <FileTextOutlined />
    </template>
  </xy-float-button>
</template>

<script lang="ts" setup>
import { FileTextOutlined } from '@xiaoye-ui/icons';
</script>
