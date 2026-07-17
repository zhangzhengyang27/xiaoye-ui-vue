<template>
  <xy-galleria
    :value="images"
    :active-index="activeIndex"
    auto-play
    circular
    :transition-interval="3000"
    :show-thumbnails="false"
    show-indicators
    @update:active-index="activeIndex = $event"
  >
    <template #item="{ item }">
      <img :src="item.src" :alt="item.title" class="main-image" />
    </template>
  </xy-galleria>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface ImageItem {
  title: string;
  src: string;
}

const activeIndex = ref(0);

const images: ImageItem[] = [
  { title: '_banner_1', src: 'https://picsum.photos/seed/b1/800/300' },
  { title: '_banner_2', src: 'https://picsum.photos/seed/b2/800/300' },
  { title: 'banner 3', src: 'https://picsum.photos/seed/b3/800/300' },
  { title: 'banner 4', src: 'https://picsum.photos/seed/b4/800/300' },
  { title: 'banner 5', src: 'https://picsum.photos/seed/b5/800/300' },
];
</script>

<style scoped>
.main-image {
  width: 100%;
  display: block;
  border-radius: 4px;
}
</style>
