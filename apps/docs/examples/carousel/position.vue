<template>
  <xy-radio-group v-model:value="dotPosition" style="margin-bottom: 8px">
    <xy-radio-button value="top">Top</xy-radio-button>
    <xy-radio-button value="bottom">Bottom</xy-radio-button>
    <xy-radio-button value="left">Left</xy-radio-button>
    <xy-radio-button value="right">Right</xy-radio-button>
  </xy-radio-group>
  <xy-carousel :dot-position="dotPosition">
    <div><h3>1</h3></div>
    <div><h3>2</h3></div>
    <div><h3>3</h3></div>
    <div><h3>4</h3></div>
  </xy-carousel>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CarouselProps } from 'xiaoye-ui';
const dotPosition = ref<CarouselProps['dotPosition']>('top');
</script>

<style scoped>
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

:deep(.slick-slide h3) {
  color: #fff;
}
</style>
