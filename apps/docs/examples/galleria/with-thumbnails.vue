<template>
  <xy-galleria
    :value="images"
    :active-index="activeIndex"
    :num-visible="numVisible"
    :responsive-options="responsiveOptions"
    show-item-navigators
    thumbnails-position="bottom"
    @update:active-index="activeIndex = $event"
  >
    <template #item="{ item }">
      <img :src="item.src" :alt="item.title" class="main-image" />
    </template>
    <template #thumbnail="{ item }">
      <div class="thumb">
        <img :src="item.thumbnail" :alt="item.title" />
        <span class="thumb-title">{{ item.title }}</span>
      </div>
    </template>
  </xy-galleria>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface ImageItem {
  title: string;
  src: string;
  thumbnail: string;
}

const activeIndex = ref(0);
const numVisible = ref(4);

const responsiveOptions = [
  { breakpoint: '1024px', numVisible: 4 },
  { breakpoint: '768px', numVisible: 3 },
  { breakpoint: '560px', numVisible: 2 },
];

const images: ImageItem[] = Array.from({ length: 8 }).map((_, i) => ({
  title: `风景 ${i + 1}`,
  src: `https://picsum.photos/seed/t${i + 1}/640/360`,
  thumbnail: `https://picsum.photos/seed/t${i + 1}/120/80`,
}));
</script>

<style scoped>
.main-image {
  width: 100%;
  display: block;
  border-radius: 4px;
}
.thumb {
  position: relative;
  width: 100%;
}
.thumb img {
  width: 100%;
  display: block;
}
.thumb-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2px 4px;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  text-align: center;
}
</style>
