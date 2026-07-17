<template>
  <xy-galleria
    :value="images"
    :active-index="activeIndex"
    @update:active-index="activeIndex = $event"
  >
    <template #item="{ item }">
      <img :src="item.src" :alt="item.title" class="main-image" />
    </template>
    <template #thumbnail="{ item }">
      <img :src="item.thumbnail" :alt="item.title" class="thumb-image" />
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

const images: ImageItem[] = [
  {
    title: '山峦',
    src: 'https://picsum.photos/seed/g1/640/360',
    thumbnail: 'https://picsum.photos/seed/g1/120/68',
  },
  {
    title: '海洋',
    src: 'https://picsum.photos/seed/g2/640/360',
    thumbnail: 'https://picsum.photos/seed/g2/120/68',
  },
  {
    title: '森林',
    src: 'https://picsum.photos/seed/g3/640/360',
    thumbnail: 'https://picsum.photos/seed/g3/120/68',
  },
  {
    title: '城市',
    src: 'https://picsum.photos/seed/g4/640/360',
    thumbnail: 'https://picsum.photos/seed/g4/120/68',
  },
];
</script>

<style scoped>
.main-image {
  width: 100%;
  display: block;
  border-radius: 4px;
}
.thumb-image {
  width: 100%;
  display: block;
  opacity: 0.7;
  transition: opacity 0.2s;
}
</style>
