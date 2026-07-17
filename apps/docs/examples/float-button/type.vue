<template>
  <xy-float-button
    type="primary"
    :style="{
      right: '24px',
    }"
  >
    <template #icon>
      <QuestionCircleOutlined />
    </template>
  </xy-float-button>

  <xy-float-button
    type="default"
    :style="{
      right: '94px',
    }"
  >
    <template #icon>
      <QuestionCircleOutlined />
    </template>
  </xy-float-button>
</template>

<script lang="ts" setup>
import { QuestionCircleOutlined } from '@xiaoye-ui/icons';
</script>
