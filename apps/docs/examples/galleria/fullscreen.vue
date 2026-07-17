<template>
  <div class="actions">
    <xy-button type="primary" @click="visible = true">打开全屏画廊</xy-button>
  </div>

  <xy-galleria
    v-model:visible="visible"
    :value="images"
    :active-index="activeIndex"
    full-screen
    show-item-navigators
    circular
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

const visible = ref(false);
const activeIndex = ref(0);

const images: ImageItem[] = [
  {
    title: '星空',
    src: 'https://picsum.photos/seed/f1/960/540',
    thumbnail: 'https://picsum.photos/seed/f1/120/68',
  },
  {
    title: '极光',
    src: 'https://picsum.photos/seed/f2/960/540',
    thumbnail: 'https://picsum.photos/seed/f2/120/68',
  },
  {
    title: '日落',
    src: 'https://picsum.photos/seed/f3/960/540',
    thumbnail: 'https://picsum.photos/seed/f3/120/68',
  },
  {
    title: '雪景',
    src: 'https://picsum.photos/seed/f4/960/540',
    thumbnail: 'https://picsum.photos/seed/f4/120/68',
  },
];
</script>

<style scoped>
.actions {
  margin-bottom: 16px;
}
.main-image {
  width: 80vw;
  max-width: 960px;
  display: block;
}
.thumb-image {
  width: 100%;
  display: block;
}
</style>
