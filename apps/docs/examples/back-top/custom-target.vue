<template>
  <div
    ref="container"
    :style="{
      height: '300px',
      overflow: 'auto',
      padding: '10px',
      border: '1px solid #f0f0f0',
      borderRadius: '4px',
    }"
  >
    <div :style="{ height: '1000px', padding: '10px' }">
      <p>在此容器内向下滚动，按钮将基于该容器的滚动位置显示。</p>
      <p>点击按钮可回到该容器顶部。</p>
    </div>
    <xy-back-top :target="getTarget" :visibility-height="50" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const container = ref<HTMLElement | null>(null);

const getTarget = () => container.value;
</script>
