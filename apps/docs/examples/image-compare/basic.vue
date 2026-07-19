<template>
  <div class="demo-image-compare">
    <xy-image-compare>
      <template #left>
        <img src="https://picsum.photos/id/1015/600/340" alt="Before" />
      </template>
      <template #right>
        <img src="https://picsum.photos/id/1016/600/340" alt="After" />
      </template>
    </xy-image-compare>
  </div>
</template>
<script lang="ts" setup>
// 基础用法：通过 left / right 插槽放置两张图片，拖动滑块对比。
</script>
<style scoped>
.demo-image-compare {
  max-width: 600px;
  margin: 0 auto;
}
.demo-image-compare img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
