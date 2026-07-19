<template>
  <div class="demo-image-compare">
    <xy-image-compare disabled :default-value="70">
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
// 禁用状态：滑块不可交互，常用于只读展示。
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
